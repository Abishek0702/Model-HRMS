import fs from "fs";
import moment from "moment";
import multer from "multer";
import path from "path";
import { apiHandler } from 'helpers/api';
const connection = require("helpers/api/routes/pool.js");
import { promisify } from 'util';


const storage = multer.diskStorage({
  destination: "./public/reports", 
});
const upload = multer({ storage: storage }).single("file"); 

export default apiHandler({
  get: add
});

async function add(req, res) {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
       res.status(500).json({ message: "Error parsing form data", status: 0 });
    } else if (err) {
       res.status(500).json({ message: "Internal Server Error", status: 0 });
    }

    const currentTime = moment().utcOffset("+5:30").format("YYYY-MM-DD");
    const status = req.query.status || "1";
    const date = typeof req.query.date !== 'undefined' ? req.query.date : "";

    const name = date !== "" ? `reports-${date}.csv` : `reports-${currentTime}.csv`;
    const filePath = path.join("public", "reports", name); // Set the file path to 'public/reports/reports-2023-07-31.csv'

    var currentdate = moment().utcOffset("+05:30").format("YYYY-MM-DD");

    if (date !== "") {
      var q = `SELECT ROW_NUMBER() OVER () AS SNo, users.employeeID as EmployeeCode, users.name as Name, 
      DATE_FORMAT(reports.startTime, '%h:%i') AS InTime, DATE_FORMAT(reports.endTime, '%h:%i') AS OutTime,
      DATE_FORMAT(TIMEDIFF(reports.endTime, reports.startTime), '%H:%i') AS TotalDuration, 
      IF( (reports.endTime IS NULL AND reports.startTime IS NULL) OR (reports.endTime IS NULL AND reports.startTime IS NOT NULL),'Absent', 'Present') AS status,'' AS remarks
      FROM users LEFT JOIN reports ON users.id = reports.user_id AND DATE(reports.startTime) = '${date}' 
      WHERE users.status = 1 ORDER BY users.id;`

    } else {
      var q = `SELECT ROW_NUMBER() OVER () AS SNo, users.employeeID as EmployeeCode, users.name as Name, 
      DATE_FORMAT(reports.startTime, '%h:%i') AS InTime, DATE_FORMAT(reports.endTime, '%h:%i') AS OutTime,
      DATE_FORMAT(TIMEDIFF(reports.endTime, reports.startTime), '%H:%i') AS TotalDuration, 
      IF( (reports.endTime IS NULL AND reports.startTime IS NULL) OR (reports.endTime IS NULL AND reports.startTime IS NOT NULL),'Absent', 'Present') AS status,'' as remarks 
      FROM users LEFT JOIN reports ON users.id = reports.user_id AND DATE(reports.startTime) = '${currentdate}' 
      WHERE users.status = 1 ORDER BY users.id;`
    }

    connection.query(q, async function (err, rows, fields) {
      if (err) {
        console.log("error: ", err);
        res.status(500).json([]);
      }

      const data = Object.values(JSON.parse(JSON.stringify(rows)));
      const columns = Object.keys(data[0]);

      const csvData = data.map(row => columns.map(column => row[column] !== null && row[column] !== undefined ? row[column] : '-'));

      const tablecolumn = columns.join(',') + '\n';
      const csvContent = tablecolumn + csvData.map(row => row.join(',')).join('\n');

      try {
        await promisify(fs.writeFile)(filePath, csvContent);
        console.log('Data exported to reports.csv successfully.');
      } catch (error) {
        console.error('Error writing CSV file:', error);
      }

      let query = "SELECT * FROM daily_reports WHERE name = ?";
      connection.query(query, [name], async function (err, result) {
        if (err) {
          console.error("Error querying data from the database", err);
          res.status(500).json({ message: "Internal Server Error", status: 0 });
        }

        if (result.length > 0) {
          res.status(200).json({ message: 'Data already exists', status: 0 });
        }

       let query = "INSERT INTO daily_reports (id,name,path,status,created_at,modified_at) VALUES (?,?,?,?,?,?)";
        let data1 = [
          null,
          name,
          filePath,
          status,
          currentTime,
          currentTime,
        ];

        connection.query(query, data1, (err, result) => {
          console.log("Result:", result);
          if (err) {
            console.error("Error inserting data into the database", err);
            res.status(500).json({ message: "Internal Server Error", status: 0 });
          }

          return res.json({
            message: "File uploaded successfully",
            status: 1,
          });
        });
      });
    });
  });
}

