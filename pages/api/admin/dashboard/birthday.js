import { apiHandler, omit } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
const moment = require('moment');

export default apiHandler({
    get: getUsersBirthdays
});

async function getUsersBirthdays(req, res) {
    try {
        var startDate = moment.utc().utcOffset('+05:30').format('MM-DD');
        console.log(startDate);
        var endDate = moment().add(30, 'day').format('MM-DD');
        console.log(endDate);

        let dataQuery = `SELECT u.id, u.name, u.employeeID, u.designation_id, d.designationName, DATE_FORMAT(u.date_of_birth, '%m-%d') as date_of_birth
        FROM users u
        LEFT JOIN designations AS d ON u.designation_id = d.id
        WHERE DATE_FORMAT(u.date_of_birth, '%m-%d') BETWEEN '${startDate}' AND '${endDate}'
        AND u.status = 1 ORDER BY u.id DESC`;

        console.log(dataQuery);

        const dataRows = await executeQuery(dataQuery);
        console.log("DataRows : ", dataRows);
        const data = JSON.parse(JSON.stringify(dataRows));
        console.log("DataRows date_of_birth :", data.date_of_birth);

        var Todays_dob_list = [];
        var remaining_dob_list = [];

        for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i];
            if (row.date_of_birth === startDate) {
                Todays_dob_list.push(row);
            } else {
                remaining_dob_list.push(row);
            }
        }

        console.log("Today's birthday list:", Todays_dob_list);

        return res.status(200).json({
            posts: data,
            Todays_birthday_list: Todays_dob_list,
            remaining_birthday_list: remaining_dob_list
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
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
