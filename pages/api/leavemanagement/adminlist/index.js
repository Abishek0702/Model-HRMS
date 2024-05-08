import { apiHandler, omit } from 'helpers/api';

const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
  get: getadminList
});


function getadminList(req, res) {

if (req.user.designation!="admin")
  return res.status(200).json({ data: "access denined", status: 0 }); 
  

  var numPerPage = parseInt(req.query.size) || 6;
  var page = parseInt(req.query.page) || 1;
  var search = req.query.search || "";

  var skip = (page - 1) * numPerPage;
  var limit = numPerPage;

  var cq = "SELECT COUNT(*) as numRows FROM leavemanagements WHERE status = 1";
  var q;

  if (search !== "") {
    q = `SELECT users.id, users.name, users.employeeID, leavemanagements.*, leavetypes.TypeofLeave, leavestatus.name AS leavestatus_name,ausers.name as ausername FROM leavemanagements LEFT JOIN leavetypes ON leavetypes.id = leavemanagements.leavetype_id LEFT JOIN leavestatus ON leavemanagements.leavestatus_id = leavestatus.id LEFT JOIN users ON leavemanagements.user_id = users.id LEFT JOIN users as ausers ON leavemanagements.approveruser_id = ausers.id  WHERE leavemanagements.status = 1 AND leavemanagements.leavestatus_id = ?ORDER BY leavemanagements.id DESC LIMIT ?, ?`;
  } else {
    q = `SELECT users.id, users.name, users.employeeID, leavemanagements.*, leavetypes.TypeofLeave, leavestatus.name AS leavestatus_name,ausers.name as ausername FROM leavemanagements LEFT JOIN leavetypes ON leavetypes.id = leavemanagements.leavetype_id LEFT JOIN leavestatus ON leavemanagements.leavestatus_id = leavestatus.id LEFT JOIN users ON leavemanagements.user_id = users.id LEFT JOIN users as ausers ON leavemanagements.approveruser_id = ausers.id  WHERE leavemanagements.status = 1 ORDER BY leavemanagements.id DESC LIMIT ${limit} OFFSET ${skip}`;
  }

  connection.query(cq, function (err, countResult) {
    if (err) {
      console.log("Error: ", err);
      return res.status(500).json({ status: "0", message: "Internal Server Error" });
    }

    var numRows = countResult[0].numRows;
    var numPages = Math.ceil(numRows / numPerPage);



    connection.query(q, [search, skip, limit], function (err, rows, fields) {
      if (err) {

        return res.status(500).json({ status: "0", message: "Internal Server Error" });
      }

      const data = rows.map(row => {
        return row;
      });

      return res.status(200).json({
        numRows: numRows,
        numPages: numPages,
        page: page,
        limit: limit,
        posts: data
      });
    });
  });
}