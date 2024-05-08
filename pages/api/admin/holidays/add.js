const moment = require('moment');
import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
    post: add
});


// Create Query

function add(req, res) {

    const { name, date, day, year, session, title, description, status } = req.body;
    const createdTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');

    const insertQuery =
        `INSERT INTO holidays(id, name, date, day, year, session, title, description, status, created_at, modified_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [null, name, date, day, year, session, title, description, status, createdTime, createdTime];

    connection.query(insertQuery, values, (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'DB error', details: err.message });
        } else {
            console.log('New Event Id:', results.insertId);
            return res.status(200).json({
                data: 'Holiday added Successfully',
                status: 1
            });
        }
    });
}
