import moment from 'moment';
import pool from 'helpers/api/routes/pool.js';

export default async function getEmpofMonth(req, res) {
    try {

        let dataQuery = `SELECT e.user_id, u.employeeID, DATE_FORMAT(e.month, '%m') as Month, e.presenter_id, e.title, e.description
        FROM employeeofmonth AS e
        LEFT JOIN users AS u 
        ON e.user_id = u.id
        WHERE e.month BETWEEN '2023-01-05' AND '2023-12-05'`;

        console.log(dataQuery);

        const dataRows = await executeQuery(dataQuery);
        console.log("DataRows: ", dataRows);

        if (dataRows.length === 0) {
            return res.status(200).json({
                posts: [],
                ThisMonth: [],
                year: [],
            });
        }

        const ThisMonth = [];
        const year = [];

        year.push(dataRows);

        const currentMonth = moment().format('MM');
        const curMonth = dataRows.filter(({ Month }) => Month == currentMonth);
        ThisMonth.push(curMonth);

        // for (let i = 0; i < dataRows.length; i++) {
        //     const row = dataRows[i];
        //     if (row.Month === currentMonth) {
        //         ThisMonth.push(row);
        //     } else {
        //         year.push(row);
        //     }
        // }

        return res.status(200).json({
            year: year,
            thismonth: ThisMonth
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

function executeQuery(query) {
    return new Promise((resolve, reject) => {
        pool.query(query, (err, rows, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
