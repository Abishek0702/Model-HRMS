import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
const moment = require('moment');

export default apiHandler({
    post: add
});

function add(req, res) {
    var currentTime = moment().utcOffset('+05:30').format('YYYY-MM-DD Hh:mm');
    const { ...empmonth } = req.body;
    var employee_id = empmonth.employee_id.toString().toUpperCase()


    var currentDate = moment().utcOffset('+05:30').format('YYYY-MM-DD');

    if (typeof empmonth.month !== "undefined" && typeof empmonth.month !== "") { var month = empmonth.month } else { var month = currentDate }

    var presenter_id = empmonth.presenter_id || 1; 
    var title = empmonth.title || '';
    var description = empmonth.description || '';


    connection.query(`SELECT * FROM employeeofmonth WHERE employee_id = ? AND DATE_FORMAT(month, '%Y-%m-%d') = ?`, [employee_id, moment(month).utcOffset("+05:30").format('YYYY-MM-DD')], function (error, result, fields) {
        if (error) {
            console.log('Error executing query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        var st = 1;
        if (result.length > 0) {
            var existingData = result[0];
            var existingMonth = moment(existingData.month).format('YY-MM'); // Format existingData.month to 'MM'
            var st = 0
            if (existingData.employee_id == employee_id && existingMonth == moment(month).format('YY-MM')) {
                res.status(200).json({ message: 'Name already exists in the month', status: 0 });
            }
        } else if (st == 1) {
            let q = `INSERT INTO employeeofmonth(id, employee_id, month, presenter_id, title, description, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)`;

            const values = [null, employee_id, month, presenter_id, title, description, 1, currentTime, currentTime];

            connection.query(q, values, async (err, result, fields) => {
                if (err) {
                    console.log('Error executing query:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    return res.status(200).json({
                        message: 'Successfully added the data',
                        status: 1,
                    });
                }
            });
        }
    });

}