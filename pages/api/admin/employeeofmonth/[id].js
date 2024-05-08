const moment = require('moment');
import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
    get: getById,
    put: update,
    delete: _delete
});


function getById(req, res) {
    const id = req.query.id;
    console.log(id);
    const getQuery = 'SELECT * FROM `employeeofmonth` WHERE `id`=? AND `status`=1';

    connection.query(getQuery, [id], (err, results) => {
        if (err) {
            console.log('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            const data = JSON.parse(JSON.stringify(results));

            if (typeof data[0] === 'undefined') {
                res.status(200).json({
                    message: 'Employee details not found',
                    status: 0
                });
            } else {
                return res.json(data[0]);
            }
        } catch (error) {
            console.log('Error parsing JSON:', error);
            res.status(500).json({ error: 'Internal Server Error', status: 0 });
        }
    });
}







function update(req, res) {
    const updatedId = req.query.id;
    const updatedTime = moment().utcOffset("+05:30").format("YYYY-MM-DD");

    connection.query(
        'SELECT * FROM `employeeofmonth` WHERE `id`=? AND `status`=1',
        [updatedId],
        (err, result) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'DB error', details: err.message });
            }
            else {

                const val = result[0];

                if (!val) {
                    res.status(200).json({ message: 'Employee details not found', status: 1 });
                }
                if (val.status === 0) {
                    res.status(200).json({ message: 'Cannot modify the fields of inactive employee', status: 0 });
                }

                const { user_id, month, presenter_id, employee_id, title, description } = req.body;

                const user_idToUpdate = user_id || val.user_id;
                const employeeIDToUpdate = employee_id || val.employee_id;

                // Handle the month value update
                let monthToUpdate = moment(val.month).utcOffset("+05:30").format('YYYY-MM-DD');
                if (month) {
                    monthToUpdate = moment(month).utcOffset("+05:30").format('YYYY-MM-DD');
                }

                const titleToUpdate = title || val.title;
                const descriptionToUpdate = description || val.description;
                const presenter_idToUpdate = presenter_id || val.presenter_id;

                const updateQuery = 'UPDATE `employeeofmonth` SET `user_id`=?, `employee_id`=? ,`month`=?,`presenter_id`=?, `title`=?, `description`=?, `updated_at`=?  WHERE `id`=?';
                const values = [user_idToUpdate, employeeIDToUpdate, monthToUpdate, presenter_idToUpdate, titleToUpdate, descriptionToUpdate, updatedTime, updatedId];

                connection.query(updateQuery, values, (err, results) => {
                    if (err) {
                        console.error(err.message);
                         res.status(500).json({ error: 'DB error', details: err.message });
                    } else {

                        return res.status(200).json({
                            message: 'Employee Details Updated Successfully',
                            status: 1
                        });
                    }
                });
            }
        });
}





// Delete Query

function _delete(req, res) {
    const id = req.query.id;

    connection.query('SELECT * FROM `employeeofmonth` WHERE `id`=? AND `status`=1', [id], (err, result) => {
        if (typeof result[0] === 'undefined') {
            res.status(200).json({
                message: 'Employee details not found',
                status: 0
            });
        }
        if (err) {
            res.json({ Error: err.message });
        }
    });

    const deleteQuery = 'UPDATE `employeeofmonth` SET `status`=0 WHERE `id`=? AND `status`=1';

    connection.query(deleteQuery, [id], function (error, result, fields) {
        if (error) {
            res.status(200).json({
                message: 'Failed to delete employee details',
                status: 0
            });
        }
        return res.json({
            message: 'Employee details deleted successfully',
            status: 1
        });
    });
}