import { apiHandler, omit } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
  get: getStatuses
});

async function getStatuses(req, res) {
  var accessstatus = 0;

  if (req.user.designation == "admin" || req.user.login_id == req.query.id) {
    accessstatus = 1;
  } else {
    return res.status(200).json([]);
  }

  if (typeof req.query.id !== "undefined") {
    try {
     
      const id = parseInt(req.query.id);


      
	if (typeof req.query.size !== 'undefined') { var numPerPage = req.query.size; } else { var numPerPage = 6; }
	if (typeof req.query.page !== 'undefined') { var page = req.query.page; } else { var page = 1; }
	

      const skip = (page - 1) * numPerPage;
      const limit = numPerPage;
      const sort = req.query.sort && req.query.sort.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      var sortbyfield = req.query.sortbyfield || 'id';

      let countQuery = `SELECT COUNT(*) AS numRows 
                        FROM leavemanagements AS lm
                        WHERE lm.status = 1 AND lm.user_id = ${id}`;

      let sumQuery = `SELECT lm.user_id, lm.leavetype_id, lt.TypeofLeave,
                      lt.Total_number_leave - COALESCE(SUM(lm.numberofDays), 0) AS Remaining_Leave
                      FROM leavemanagements AS lm
                      LEFT JOIN leavetypes AS lt ON lt.id = lm.leavetype_id
                      LEFT JOIN leavestatus AS ls ON ls.id = lm.leavestatus_id
                      WHERE lm.user_id = ${id} 
                      AND ls.id = 2 AND lm.status=1
                      GROUP BY lm.user_id, lt.id`;

      let dataQuery = `SELECT lm.*, lt.TypeofLeave, ls.name, lt.Total_number_leave
                       FROM leavemanagements AS lm
                       LEFT JOIN leavetypes AS lt ON lm.leavetype_id = lt.id
                       LEFT JOIN leavestatus AS ls ON lm.leavestatus_id = ls.id
                       WHERE lm.user_id = ${id} AND lm.status=1
                       ORDER BY lm.${sortbyfield} ${sort} 
                       LIMIT ${limit}
                       OFFSET ${skip}`;

      const countRows = await executeQuery(countQuery);
      const numRows = countRows[0].numRows;
      const numPages = Math.ceil(numRows / numPerPage);

      const sumRows = await executeQuery(sumQuery);
      const dataRows = await executeQuery(dataQuery);

      const data = JSON.parse(JSON.stringify(dataRows));
      const leavetypesQuery = `SELECT * FROM leavetypes WHERE id IN (1, 2, 3)`;
      const leavetypesData = await executeQuery(leavetypesQuery);
      const totalLeaveMap = {};
      for (const lt of leavetypesData) {
        totalLeaveMap[lt.id] = lt.Total_number_leave;
      }

      const remainingLeaveMap = {};
      for (const row of sumRows) {
        if (row.leavetype_id === 1 && row.Remaining_Leave <= 0) {
          remainingLeaveMap[3] = (remainingLeaveMap[3] || 0) + row.Remaining_Leave;
          remainingLeaveMap[row.leavetype_id] -= row.Remaining_Leave;
          if (remainingLeaveMap[row.leavetype_id] <= 0) {
            remainingLeaveMap[row.leavetype_id] = 0;
          }
        } else if (row.leavetype_id === 2 && (row.Remaining_Leave <= 0 || row.Remaining_Leave === 0)) {
          remainingLeaveMap[3] = (remainingLeaveMap[3] || 0) + row.Remaining_Leave;
          remainingLeaveMap[row.leavetype_id] = -row.Remaining_Leave;
          if (remainingLeaveMap[row.leavetype_id] <= 0) {
            remainingLeaveMap[row.leavetype_id] = 0;
          }
        } else {
          remainingLeaveMap[row.leavetype_id] = row.Remaining_Leave;
        }
        totalLeaveMap[row.leavetype_id] = row.Total_number_leave;
      }

      const fulldata = {
        Casual_Leave: totalLeaveMap[2] || 8,
        Sick_Leave: totalLeaveMap[1] || 8,
        LOP: totalLeaveMap[3] || 0,
        Remaining_CS: remainingLeaveMap[2] || totalLeaveMap[2] || 0,
        Remaining_SL: remainingLeaveMap[1] || totalLeaveMap[1] || 0,
        Remaining_LOP: Math.max(0, -remainingLeaveMap[3] || totalLeaveMap[3] || 0),
      };

      return res.status(200).json({
        numRows: numRows,
        numPages: numPages,
        page: page,
        limit: limit,
        size: data.length,
        posts: data,
        summaryData: sumRows,
        Summary: fulldata
      });
    } catch (error) {
      console.log("Error: ", error);
      res.status(500).json({ status:"0", message: "Internal Server Error" });
    }
  } else {
    res.status(200).json({status:"0", message: "Error" });
  }
}

function executeQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, rows, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
