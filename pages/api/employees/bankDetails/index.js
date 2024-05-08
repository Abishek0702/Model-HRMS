import { apiHandler, omit } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
import moment from 'moment';

export default apiHandler({
    get: getbankDetails
});

function getbankDetails(req, res) {
    const search = req.query.search || '';
    const searchbyfield = req.query.searchbyfield || '';
    const sort = req.query.sort || (req.query.sort === 'asc' ? 'ASC' : 'DESC');
    const sortByfield = req.query.sortByfield || 'id';
    const numPerPage = req.query.size || 6;
    const page = req.query.page || 1;
    const skip = (page - 1) * numPerPage;
    const limit = numPerPage;

    let queryv;
    if (search !== '' && searchbyfield !== '') {
        queryv = `SELECT count(*) as numRows FROM bankdetails WHERE status=1 AND ${searchbyfield} LIKE '%${search}%'`;
    } else if (search !== '' && searchbyfield === '') {
        queryv = `SELECT count(*) as numRows FROM bankdetails WHERE status=1 AND user_id LIKE '%${search}%'`;
    } else {
        queryv = 'SELECT count(*) as numRows FROM bankdetails WHERE status=1';
    }

    connection.query(queryv, function (err, rows, fields) {
        try {
            if (err) { return res.status(200).json({ message: "Connection Query Error", status: 0 }); }
            else {
                const numRows = rows[0].numRows;
                const numPages = Math.ceil(numRows / numPerPage);

                let q;
                if (search !== '' && searchbyfield !== '') {
                    q = `SELECT * FROM bankdetails WHERE ${searchbyfield} LIKE '%${search}%' AND status=1 ORDER BY ${sortByfield} ${sort} LIMIT ${limit} OFFSET ${skip}`;
                }
                else if (search !== '' && searchbyfield == '') {
                    q = `SELECT * FROM bankdetails WHERE user_id LIKE '%${search}%' AND status=1 ORDER BY ${sortByfield} ${sort} LIMIT ${limit} OFFSET ${skip}`;
                }
                else {
                    q = `SELECT * FROM bankdetails WHERE status=1 ORDER BY ${sortByfield} ${sort} LIMIT ${limit} OFFSET ${skip}`;
                }

                connection.query(q, function (err, rows, fields) {
                    if (err) { return res.status(200).json({ message: "Main Query Error", status: 0 }); }

                    const data = JSON.parse(JSON.stringify(rows));
                    const promises = [];
                    for (let i = 0; i < data.length; i++) {
                        const formatted_c = moment.utc(data[i].created).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                        const formatted_u = moment.utc(data[i].updated).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');

                        data[i].created = formatted_c;
                        data[i].updated = formatted_u;
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
                });
            }
        }
        catch (error) { return res.status(500).json({ message: "Internal Server Error " }); }
    });
}
