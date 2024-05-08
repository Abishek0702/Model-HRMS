import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
const moment = require('moment');

export default apiHandler({
    get: getcount
});

function getcount(req, res) {

    var reverseDates = [];
    var currentdate = moment().utcOffset("+05:30").format("YYYY-MM-DD");

    for (let i = 0; i < 7; i++) {
        const reverseDate = moment(currentdate).subtract(i, 'days').format("YYYY-MM-DD");
        reverseDates.push(reverseDate);
    }
    var reversedDates = [...reverseDates].reverse();


    const q1 = `SELECT COUNT(*) AS totalcount, DATE_FORMAT(users.created_at, '%Y-%m-%d') AS create_date FROM users LEFT JOIN reports ON reports.user_id = users.id AND reports.startTime <= users.created_at WHERE users.status=1 GROUP BY create_date ORDER BY create_date`;

    const q2 = `SELECT DATE_FORMAT(reports.startTime, '%Y-%m-%d') AS date, COUNT(reports.startTime) AS presentcount FROM users LEFT JOIN reports ON reports.user_id = users.id WHERE users.status = 1 AND DATE_FORMAT(reports.startTime, '%Y-%m-%d') IN ('${reverseDates.join("','")}') GROUP BY date ORDER BY date`;


    connection.query(q1, (err, results1) => {
        // console.log("q1", q1);
        if (err) {
            console.log('Error executing query 1:', err);
            return res.status(500).json({ message: 'Error executing query', status: 0 });
        }

        connection.query(q2, (err, results2) => {
            // console.log("q2", q2);
            if (err) {
                console.log('Error executing query 2:', err);
                return res.status(500).json({ message: 'Error executing query', status: 0 });
            }

            var count3 = results1.reduce((total, row) => total + row.totalcount, 0);
            var count3count = [count3];

            var count1 = Array.from(results1.map((row) => row.totalcount));

            var count2 = reversedDates.map((date) => {
                var Result1 = results1.find((row1) => row1.create_date === date);
                var newcout = results1.totalcount
                var Result2 = Result1 ? Result1.totalcount + count1[0] : count3count[0];
                return Result2;
            });

            var countreverse = [...count2].reverse();

            var dates = results2.map((row) => row.date); // reports present dates

            const presentcount = reverseDates.map((date) => {
                const index = dates.indexOf(date);
                return index !== -1 ? results2.find((row) => row.date === date)?.presentcount || 0 : 0;
            });

            const absentcount = countreverse.map((count3, index) => Math.abs(count3 - presentcount[index]));

            // const trace1 = {
            //   x: [...reverseDates],
            //   y: [...countreverse],
            //   name: "TotalEmployees",
            //   type: "line"
            // };

            const trace2 = {
                x: [...reverseDates],
                y: presentcount,
                name: "Present",
                type: "bar", marker: {
                    color: '#bee6f6',
                },
                textposition: 'auto',
            };

            const trace3 = {
                x: [...reverseDates],
                y: absentcount,
                name: "Absent",
                type: "bar",
                marker: {
                    color: '#03559f',
                },
                textposition: 'auto',
            };

            const dataPoints = [trace2, trace3];


          //  console.log("Data points:", dataPoints);

            return res.json(dataPoints);
        });
    });
    // }
}

