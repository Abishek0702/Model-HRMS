import { apiHandler, omit } from 'helpers/api';
import { from } from 'rxjs';
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
    get: getEvents
});

function getEvents(req, res) {

    const search = req.query.search || '';
    const numPerPage = req.query.size || 6;
    const page = req.query.page || 1;

    const skip = (page - 1) * numPerPage;
    const limit = `${skip},${numPerPage}`;


    connection.query('SELECT count(*) AS numRows FROM holidays WHERE status=1', function (err, rows, fields) {

       // console.log("Rows : ", rows);
        try {
            if (err) {
                console.log("error: ", err);
                return res.status(200).json({ message: "Connection Query Error", status: 0 });
            } else {
                const numRows = rows[0].numRows;
                console.log("numRows : ", numRows);
                const numPages = Math.ceil(numRows / numPerPage);
                console.log("numPages : ", numPages);

                let q;

                if (search !== "") {
                    q = `SELECT id, name,date, DATE_FORMAT(date, '%m') as month, DAYNAME(date) AS day, YEAR(date) AS year,
                    session, title, description, status, created_at, modified_at
                    FROM holidays
                    WHERE date BETWEEN '2023-01-01' AND '2023-12-31'
                    AND name='${search}' AND status=1`;
                } else {
                    q = `SELECT id, name,date, DATE_FORMAT(date, '%m') as month, DAYNAME(date) AS day, YEAR(date) AS year,
                    session, title, description, status, created_at, modified_at
                    FROM holidays
                    WHERE date BETWEEN '2023-01-01' AND '2023-12-31' AND status=1 `;
                }

                connection.query(q, function (err, rows, fields) {

                   // console.log("Query Row : ", rows);

                    if (err) {
                        console.log("error: ", err);
                        return res.status(200).json([]);
                    }

                    const data = JSON.parse(JSON.stringify(rows));
                   // console.log("promisedata:", data[0]);

                    const promises = [];
                    for (let i = 0; i < data.length; i++) {
                        promises.push(data[i]);
                      //  console.log("loopdata:", data[i]);
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
                        .catch(err => {
                            return res.status(200).json([]);
                        });
                });

            }
        } catch (error) {
            console.log("JSON parsing error: ", error);
            return res.status(500).json({ message: "Internal Server Error " });
        }
    })
}

