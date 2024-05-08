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
    connection.query('SELECT * FROM `geons_events` WHERE `id`=? AND `status`=1', [id], (err, results) => {
        const data = JSON.parse(JSON.stringify(results)); if (err) {
            console.log('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        } else if (typeof data[0] === "undefined") {
            return res.status(200).json({ message: "Events not found", status: 0 })
        } else {
            const formatted_event_date = moment.utc(data[0].event_date).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'); const formatted_c = moment.utc(data[0].created_at).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'); const formatted_m = moment.utc(data[0].modified_at).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'); data[0].event_date = formatted_event_date; data[0].created_at = formatted_c; data[0].modified_at = formatted_m; return res.json(data[0]);
        }
    });
}

// Update Query
function update(req, res) {
    const updatedId = req.query.id;
    const { ...user } = req.body;

    var updatedTime = moment.utc().utcOffset('+05:30').format("YYYY-MM-DD HH:mm");

    connection.query('SELECT * FROM `geons_events` WHERE `id`=? AND `status`=1', [updatedId],
        (err, result) => {
            console.log("results", result);
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'DB error', details: err.message });
            } else {
                var val = JSON.parse(JSON.stringify(result));

                if (typeof user.event_type_id !== "undefined" && user.event_type_id !== "") {
                    var event_type_id = user.event_type_id
                } else { var event_type_id = val[0].event_type_id; }


                let event_dateToUpdate = moment(val[0].event_date).utcOffset("+05:30").format('YYYY-MM-DD');
                if (user.event_date) {
                    event_dateToUpdate = moment(user.event_date).utcOffset("+05:30").format('YYYY-MM-DD');
                }

                // if (typeof user.event_date !== "undefined" && user.event_date !== "") { var event_date = user.event_date; } else { var event_date = val[0].event_date }

                if (typeof user.title !== "undefined" && user.title !== "") { var title = user.title } else { var title = val[0].title }

                if (typeof user.description !== "undefined" && user.description !== "") { var description = user.description } else { var description = val[0].description }

                if (typeof user.link !== "undefined" && user.link !== "") {
                    var link = user.link;
                } else { var link = val[0].link }

                const updateQuery = 'UPDATE `geons_events` SET `event_type_id`=?, `event_date`=?, `title`=?, `description`=?, `link`=?, `modified_at`=? WHERE `id`=?';

                const values = [event_type_id, event_dateToUpdate, title, description, link, updatedTime, updatedId];

                connection.query(updateQuery, values, (err, results) => {
                    console.log("updateQuery", updateQuery);
                    console.log("updateQuery", values);
                    if (err) {
                        console.error(err.message);
                        res.status(500).json({ error: 'DB error', details: err.message });
                    } else { return res.status(200).json({ message: 'Event Details Updated Successfully', status: 1 }); z }
                });
            }
        });
}

// Delete Query
function _delete(req, res) {
    const id = req.query.id;
    connection.query('SELECT * FROM `geons_events` WHERE `id`=? AND `status`=1', [id], (err, result) => {
        if (err) { return res.json({ Error: err.message }); }
        else {
            const deleteQuery = 'UPDATE `geons_events` SET `status`=0 WHERE `id`=? AND `status`=1';

            connection.query(deleteQuery, [id], function (error, result, fields) {
                if (error) { return res.status(200).json({ message: 'Failed to delete events', status: 0 }); }
                else { return res.json({ message: 'Event details deleted successfully', status: 1 }); }
            });
        }
    });
}
