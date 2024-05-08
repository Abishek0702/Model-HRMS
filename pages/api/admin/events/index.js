import { apiHandler, omit } from 'helpers/api';
import { from } from 'rxjs';
const connection = require('helpers/api/routes/pool.js');
import moment from 'moment';

export default apiHandler({
    get: getEvents
});

function getEvents(req, res) {

    const event = req.query.event || '';
    const numPerPage = req.query.size || 6;
    const page = req.query.page || 1;
    const skip = (page - 1) * numPerPage;
    const limit = numPerPage;

    const date = new Date();
    const currentYear = date.getFullYear();
    const start = new Date(currentYear, 0, 2);
    const end = new Date(currentYear, 12, 1);
    const startDate = moment.utc(start).format("YYYY-MM-DD");
    const endDate = moment.utc(end).format("YYYY-MM-DD")
    console.log("start", startDate);
    console.log("end", endDate);

    connection.query('SELECT count(*) AS numRows FROM geons_events WHERE status=1', function (err, rows, fields) {

        if (err) { console.log("error: ", err); return res.status(200).json({ message: "Connection Query Error", status: 0 }); }
        else {
            const numRows = rows[0].numRows;
            console.log("numRows : ", numRows);
            const numPages = Math.ceil(numRows / numPerPage);
            console.log("numPages : ", numPages);

            let q;
            if (event !== "") {
                q = `SELECT ge.id, ge.event_type_id, et.type_of_events DATE_FORMAT(ge.event_date, '%Y-%m-%d') as event_date,
                DATE_FORMAT(ge.event_date, '%m') as Month, ge.title, ge.description, ge.link,ge.created_at
                FROM geons_events AS ge
                LEFT JOIN event_types et
                ON ge.event_type_id = et.id
                WHERE ge.event_date BETWEEN '${startDate}' AND '${endDate}' AND ge.status=1
                AND et.type_of_event LIKE '${event}'`;
            } else {
                q = `SELECT ge.id, ge.event_type_id, et.type_of_event, DATE_FORMAT(ge.event_date, '%Y-%m-%d') as event_date,
                DATE_FORMAT(ge.event_date, '%m') as Month, ge.title, ge.description, ge.link,ge.created_at
                FROM geons_events AS ge
                LEFT JOIN event_types et
                ON ge.event_type_id = et.id
                WHERE ge.event_date BETWEEN '${startDate}' AND '${endDate}' AND ge.status=1 ORDER BY id DESC LIMIT ${limit} OFFSET ${skip}`;
            }

            connection.query(q, function (err, rows, fields) {
                if (err) { console.log("error: ", err); return res.status(200).json([]); }
                else {
                    const data = JSON.parse(JSON.stringify(rows));
                    const promises = [];
                    for (let i = 0; i < data.length; i++) {
                        promises.push(data[i]);
                    }
                    Promise.all(promises)
                        .then(function (resp) {
                            return res.status(200).json({
                                numRows: numRows,
                                numPages: numPages,
                                page: page,
                                limit: limit,
                                posts: data
                            });
                        })
                        .catch(err => { return res.status(200).json([]); });
                }

            });

        }
    })
}