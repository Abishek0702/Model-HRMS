import { apiHandler } from 'helpers/api';
import moment from 'moment';
const connection = require('helpers/api/routes/pool.js');

var data_exporter = require('json2csv').Parser;


export default apiHandler({
    get: downloadReports
});

async function downloadReports(req, res) {
    try {
        const date = req.query.date;
        const currentdate = moment().utcOffset("+05:30").format("YYYY-MM-DD");


        if (date !== "") {
            var q = `SELECT ROW_NUMBER() OVER () AS SNo, users.employeeID as EmployeeCode, users.name as Name, 
            reports.startTime AS InTime,reports.endTime AS OutTime,
            DATE_FORMAT(TIMEDIFF(reports.endTime, reports.startTime), '%H:%i') AS TotalDuration, 
            IF(reports.endTime IS NULL AND reports.startTime IS NULL, 'Absent', 'Present') AS status,'' AS remarks
            FROM users LEFT JOIN reports ON users.id = reports.user_id AND DATE(reports.startTime) = '${date}' 
            WHERE users.status = 1 ORDER BY users.id;`

        } else {
            var q = `SELECT ROW_NUMBER() OVER () AS SNo, users.employeeID as EmployeeCode, users.name as Name, 
            reports.startTime AS InTime,reports.endTime AS OutTime,
            DATE_FORMAT(TIMEDIFF(reports.endTime, reports.startTime), '%H:%i') AS TotalDuration, 
            IF(reports.endTime IS NULL AND reports.startTime IS NULL, 'Absent', 'Present') AS status,'' as remarks 
            
            FROM users LEFT JOIN reports ON users.id = reports.user_id AND DATE(reports.startTime) = '${currentTime}' 
            WHERE users.status = 1 ORDER BY users.id;`
        }
        connection.query(q, async (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ status: 1, message: "Internal Server Error" });
            }

            if (!result || result.length === 0) {
                return res.status(404).json({ status: 1, message: "User details not found." });
            }


            var data = JSON.parse(JSON.stringify(result));

            var mysql_data1 = []
            
            for (var i = 0; i < data.length; i++) {
                if (data[i].InTime !== null && data[i].OutTime !== null) {
                    var Totalduration = moment(data[i].OutTime).utcOffset("+05:30").diff(moment(data[i].InTime).utcOffset("+05:30"), 'minutes');

                    if (Totalduration >= (9 * 60)) { // Compare with 9 hours (9 * 60 minutes)
                        data[i].InTime = moment(data[i].InTime).utcOffset("+05:30").format("hh:mm A");
                        data[i].OutTime = moment(data[i].OutTime).utcOffset("+05:30").format("hh:mm A");
                        data[i].status = "Present";
                        data[i].TotalDuration = moment.utc(Totalduration * 60000).format("hh:mm A"); // Convert minutes to hh:mm A format
                        data[i].date = req.query.date || currentdate
                    } else {
                        data[i].InTime = moment(data[i].InTime).utcOffset("+05:30").format("hh:mm A");
                        data[i].OutTime = moment(data[i].OutTime).utcOffset("+05:30").format("hh:mm A");
                        data[i].status = "Partial";
                        data[i].TotalDuration = moment.utc(Totalduration * 60000).format("hh:mm A");
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


                mysql_data1.push(data[i])
            }

            //convert JSON to CSV Data

            var file_header = ['SNo', 'EmployeeCode', 'Name', 'InTime', 'OutTime', 'TotalDuration', 'status', 'remarks'];

            var json_data = new data_exporter({ file_header });
            var csv_data = json_data.parse(mysql_data1);

            res.setHeader("Content-Type", "text/csv");

            if (date) { res.setHeader(`Content-Disposition`, `attachment; filename=${date}.csv`); }
            if (!date) { res.setHeader(`Content-Disposition`, `attachment; filename=${currentTime}.csv`); }

            return res.status(200).end(csv_data);

        });
    } catch (error) {
        console.error("Unhandled error:", error);
        return res.status(500).json({ status: 1, message: "Internal Server Error" });
    }
}