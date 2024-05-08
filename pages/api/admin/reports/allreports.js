import { apiHandler, omit } from 'helpers/api';  // Removed unnecessary import
const moment = require('moment');

const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
  get: getReports
});

function getReports(req, res) {
  console.log('query---', req.query.page, req.query.size);

  const numPerPage = req.query.size || 6;
  const page = req.query.page || 1;
  const search = req.query.search || "";

  const skip = (page - 1) * numPerPage;
  const limit = `${skip},${numPerPage}`;

  connection.query('SELECT count(reports.status) as numRows FROM users LEFT JOIN reports ON users.id = reports.user_id WHERE users.status = 1;;', function (err, rows, fields) {
    if (err) {
      console.log("error: ", err);
      return res.status(500).json({ error: "An error occurred." });
    }

    const numRows = rows[0].numRows;
    const numPages = Math.ceil(numRows / numPerPage);

    const reverseDates = [];
    const currentdate = moment().utcOffset("+05:30").format("YYYY-MM-DD");

    for (let i = 0; i < 2; i++) {
      const reverseDate = moment(currentdate).subtract(i, 'days').format("YYYY-MM-DD");
      reverseDates.push(reverseDate);
    }

    //const dateFilter = reverseDates.map(date => `DATE_FORMAT(reports.startTime, '%Y-%m-%d') = '${date}'`).join(" OR ");
    //console.log('datefilter', dateFilter);

    // const q = `SELECT reports.id as Rid, users.employeeID as EmployeeCode, users.name as Name, reports.startTime AS InTime, reports.endTime AS OutTime, CONCAT(TIME_FORMAT(SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(reports.endTime, reports.startTime))), '%H:%i')) AS TotalDuration, IFNULL((CASE WHEN reports.endTime IS NULL AND reports.startTime IS NULL THEN 'Absent' ELSE 'Present' END), 'Absent') AS status, DATE_FORMAT(reports.startTime, '%Y-%m-%d') AS date FROM users LEFT JOIN reports ON users.id = reports.user_id and (${dateFilter}) WHERE users.status = 1 ORDER BY users.employeeID DESC LIMIT ${limit};`;

    const q = `SELECT reports.id as rID,reports.start_ip,reports.end_ip, users.employeeID as EmployeeCode, users.name as Name, reports.startTime AS InTime, reports.endTime AS OutTime, CONCAT(TIME_FORMAT(SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(reports.endTime, reports.startTime))), '%H:%i')) AS TotalDuration , DATE_FORMAT(reports.startTime, '%Y-%m-%d') AS date FROM users LEFT JOIN reports ON users.id = reports.user_id   WHERE users.status = 1 ORDER BY users.employeeID DESC LIMIT ${limit};`;
    console.log('q', q);

    connection.query(q, function (err, rows, fields) {
      if (err) {
        console.log("error: ", err);
        res.status(200).json([]);
      } else {
        const data = Object.values(JSON.parse(JSON.stringify(rows)));

        var promise = [];

        var currentdate = moment().utcOffset("+05:30").format("YYYY-MM-DD");

        for (var i = 0; i < data.length; i++) {
          if (data[i].InTime !== null && data[i].OutTime !== null) {
            var Totalduration = moment(data[i].OutTime).utcOffset("+05:30").diff(moment(data[i].InTime).utcOffset("+05:30"), 'minutes');

            if (Totalduration >= (9 * 60)) { // Compare with 9 hours (9 * 60 minutes)
              data[i].InTime = moment(data[i].InTime).utcOffset("+05:30").format("hh:mm A");
              data[i].OutTime = moment(data[i].OutTime).utcOffset("+05:30").format("hh:mm A");
              data[i].status = "Present";
              data[i].TotalDuration = moment.utc(Totalduration * 60000).format("hh:mm"); // Convert minutes to hh:mm A format
              data[i].date = req.query.date || currentdate
            } else {
              data[i].InTime = moment(data[i].InTime).utcOffset("+05:30").format("hh:mm A");
              data[i].OutTime = moment(data[i].OutTime).utcOffset("+05:30").format("hh:mm A");
              data[i].status = "Partial";
              data[i].TotalDuration = moment.utc(Totalduration * 60000).format("hh:mm");
              data[i].date = req.query.date || currentdate
            }
          } else if (data[i].InTime !== null && data[i].OutTime == null) {
            data[i].InTime = moment(data[i].InTime).utcOffset("+05:30").format("hh:mm A");
            data[i].OutTime = "--:--";
            data[i].TotalDuration = "--:--"
            data[i].status = "Partial";
            data[i].date = req.query.date || currentdate
          } else if (data[i].InTime == null && data[i].OutTime == null) {
            data[i].InTime = "--:--";
            data[i].OutTime = "--:--";
            data[i].TotalDuration = "--:--"
            data[i].status = "Absent";
            data[i].date = req.query.date || currentdate
          }

          promise.push(data[i]);
        }

      }
     

      return res.status(200).json({
        numRows: numRows,
        numPages: numPages,
        page: page,
        limit: limit,
        posts: promise
      });
    });
  })
}