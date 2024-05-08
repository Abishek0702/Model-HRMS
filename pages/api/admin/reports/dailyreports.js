import { apiHandler } from 'helpers/api';
const moment = require('moment');
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
    get: getdailyreports
});

function getdailyreports(req, res) {

    var currentdate = moment().utcOffset("+05:30").format("YYYY-MM-DD");

    if (typeof req.query.size !== "undefined") { var numPerPage = req.query.size } else { var numPerPage = 6 }
    if (typeof req.query.page !== "undefined") { var page = req.query.page } else { var page = 1 }
    if (typeof req.query.date !== "undefined") { var date = req.query.date } else { var date = "" }
    if (typeof req.query.id !== "undefined") { var id = req.query.id } else { var id = "" }

    var skip = (page - 1) * numPerPage;
    var limit = skip + ',' + numPerPage;

    var cq;
    if (date !== "") {
        cq = `SELECT count(*) as numRows,COUNT(reports.startTime) AS presentcount FROM users LEFT JOIN reports ON users.id = reports.user_id AND DATE_FORMAT(reports.startTime, '%Y-%m-%d')='${date}' WHERE users.status = 1`;
    } else {
        cq = `SELECT count(*) as numRows,COUNT(reports.startTime) AS presentcount FROM users LEFT JOIN reports ON users.id = reports.user_id AND DATE_FORMAT(reports.startTime, '%Y-%m-%d')='${currentdate}' WHERE users.status = 1`
    }

    connection.query(cq, function (err, rows, fields) {
        if (err) {
            console.log("error: ", err);
            return res.status(500).json({ error: "Error fetching count data" });
        } else {
            var numRows = rows[0].numRows;
            var numPages = Math.ceil(numRows / numPerPage);

            var q;
            if (date !== "") {
                q = `SELECT users.id as uid, users.employeeID as EmployeeCode, users.name as Name, reports.startTime AS InTime, reports.endTime AS OutTime, CONCAT(TIME_FORMAT(SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(reports.endTime, reports.startTime))), '%H:%i')) AS TotalDuration FROM users LEFT JOIN reports ON users.id = reports.user_id AND DATE(reports.startTime) = '${date}' WHERE users.status = 1 ORDER BY users.employeeID DESC LIMIT ${limit} `;
            }
            else {
                q = `SELECT users.id as uid, users.employeeID as EmployeeCode, users.name as Name, reports.startTime AS InTime, reports.endTime AS OutTime, CONCAT(TIME_FORMAT(SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(reports.endTime, reports.startTime))), '%H:%i')) AS TotalDuration FROM users LEFT JOIN reports ON users.id = reports.user_id AND DATE(reports.startTime) = '${currentdate}' WHERE users.status = 1 ORDER BY users.employeeID DESC LIMIT ${limit}`;
            }



            connection.query(q, function (err, rows, fields) {
                if (err) {
                    console.log("error: ", err);
                    return res.status(500).json({ error: "Error fetching data" });
                } else {
                    const data = Object.values(JSON.parse(JSON.stringify(rows)));

                    var promise = [];

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


                    return res.status(200).json({
                        numRows: numRows,
                        numPages: numPages,
                        page: page,
                        limit: limit,
                        posts: promise
                    });
                }
            });
        }
    });
}