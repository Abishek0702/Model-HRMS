const moment = require('moment');
import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
    get: getById,
    put: update,
    delete: _delete
});

// getById Query

function getById(req, res) {
    const id = req.query.id;
    console.log(id);
    const getQuery = 'SELECT * FROM `holidays` WHERE `id`=? AND `status`=1';

    connection.query(getQuery, [id], (err, results) => {
        if (err) {
            console.log('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            const data = JSON.parse(JSON.stringify(results));
            console.log('Holiday Data:', data[0]);

            if (typeof data[0] === 'undefined') {
                return res.status(200).json({
                    message: 'Holiday details not found',
                    status: 0
                });
            } else {
                return res.json(data[0]);
            }
        } catch (error) {
            console.log('Error parsing JSON:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}

// Update Query

function update(req, res) {
    const updatedId = req.query.id;
    const updatedTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');

    connection.query(
        'SELECT * FROM `holidays` WHERE `id`=? AND `status`=1',
        [updatedId],
        (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'DB error', details: err.message });
            }

            const val = result[0];
            console.log("val :", val);

            if (!val) {
                return res.status(200).json({
                    message: 'Holiday details not found',
                    status: 1
                });
            }

            if (val.status === 0) {
                return res.status(200).json({
                    message: 'Cannot modify the fields of inactive employee',
                    status: 0
                });
            }

            const {  name, date, day, year, session, title, description, status } = req.body;
            
            const nameToUpdate = name || val.name;
            const dateToUpdate = date || val.date;
            const dayToUpdate = day || val.day;
            const yearToUpdate = year || val.year;
            const sessionToUpdate = session || val.session;
            const descriptionToUpdate = description || val.description;
            const titleToUpdate = title || val.title;
            const statusToUpdate = status || val.status;

            const updateQuery = 'UPDATE `holidays` SET `name`=?, `date`=?, `day`=?, `year`=?, `session`=?,`title`=?, `description`=?, `status`=? WHERE `id`=?';
            const values = [nameToUpdate, dateToUpdate, dayToUpdate, yearToUpdate, sessionToUpdate, titleToUpdate, descriptionToUpdate, statusToUpdate, updatedId];

            connection.query(updateQuery, values, (err, results) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'DB error', details: err.message });
                } else {
                    console.log('Updated Holiday Id:', updatedId);

                    return res.status(200).json({
                        data: 'Holiday Details Updated Successfully',
                        status: 1
                    });
                }
            });
        }
    );
}

// Delete Query

function _delete(req, res) {
    const id = req.query.id;

    connection.query('SELECT * FROM `holidays` WHERE `id`=? AND `status`=1', [id], (err, result) => {
        if (typeof result[0] === 'undefined') {
            return res.status(200).json({
                message: 'Events not found',
                status: 0
            });
        }
        if (err) {
            return res.json({ Error: err.message });
        }
    });

    const deleteQuery = 'UPDATE `holidays` SET `status`=0 WHERE `id`=? AND `status`=1';

    connection.query(deleteQuery, [id], function (error, result, fields) {
        if (error) {
            return res.status(200).json({
                message: 'Failed to delete holiday',
                status: 0
            });
        }
        return res.json({
            message: 'Holiday details deleted successfully',
            status: 1
        });
    });
}
