import { apiHandler, omit } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
import moment from 'moment';
export default apiHandler({
    get: getReferenceDetails
});

function getReferenceDetails(req, res) {
    const search = req.query.search || '';
    const numPerPage = req.query.size || 6;
    const page = req.query.page || 1;
    const skip = (page - 1) * numPerPage;
    const limit = `${skip},${numPerPage}`;

    connection.query('SELECT count(*) as numRows FROM `referencedetails` WHERE status=1', function (err, rows, fields) {
        try {
            if (err) { console.log("error: ", err); return res.status(200).json({ message: "Connection Query Error", status: 0 }); }
            else {
                const numRows = rows[0].numRows;
                const numPages = Math.ceil(numRows / numPerPage);

                let q;
                if (search !== "") {
                    q = `SELECT * FROM referencedetails WHERE user_id LIKE '${search}' AND status=1 ORDER BY id LIMIT ${limit} OFFSET ${skip}`;
                } else {
                    q = `SELECT * FROM referencedetails WHERE status=1 ORDER BY id LIMIT ${limit}`;
                }

                connection.query(q, function (err, rows, fields) {
                    if (err) { console.log("error: ", err); return res.status(200).json([]); }
                    else {
                        const data = JSON.parse(JSON.stringify(rows));
                        const formatted_c = moment.utc(data[0].created).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                        const formatted_u = moment.utc(data[0].modified).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                        data[0].created = formatted_c;
                        data[0].modified = formatted_u;

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
        } catch (error) { console.log("JSON parsing error: ", error); return res.status(500).json({ message: "Internal Server Error " }); }
    });
}
