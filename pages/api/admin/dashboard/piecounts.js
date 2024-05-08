import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
    get: getcount
});

function getcount(req, res) {
    var date = typeof req.query.date !== 'undefined' ? req.query.date : "";

    if (date == "") {
        var q = `SELECT gender, COUNT(*) AS totalcount FROM users GROUP BY gender`;
    } else {
        var q = `SELECT gender, COUNT(*) AS usercounts, COUNT(DATE_FORMAT(reports.startTime, '%Y-%m-%d')) AS totalcount FROM users LEFT JOIN reports ON reports.user_id = users.id AND DATE_FORMAT(reports.startTime, '%Y-%m-%d') = '${date}' WHERE users.status = 1 GROUP BY gender ORDER BY users.id`;
    }

    // ... (your existing code)

    connection.query(q, (err, results) => {
        if (err) {
            console.log('Error executing query:', err);
            return res.status(500).json({ message: 'Error executing query', status: 0 });
        }

        const values = results.map((row) => row.totalcount);
        const labels = results.map((row) => row.gender);

        // console.log("values:", values);
        // console.log("labels:", labels);

        const gendercount = values.reduce((total, count) => total + count, 0);

        const pieChartData = [{
            values,
            labels,
            gendercount,
            data: 'Employee data',
            type: 'pie',
            hole: .7,
            textposition: "outside",
            textinfo: "label+value",
            marker: {
                colors: ["#bee6f6", "#03559f"]
            },
        }]


        return res.json(pieChartData);
    });
}