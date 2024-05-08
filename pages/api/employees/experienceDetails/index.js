import { apiHandler, omit } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
    get: getexperienceDetails
});

function getexperienceDetails(req, res) {
    const search = req.query.search || '';
    const numPerPage = req.query.size || 6;
    const page = req.query.page || 1;

    const skip = (page - 1) * numPerPage;
    const limit = numPerPage;

    let queryv;
    
    if (search !== '' && searchbyfield !== '') {
        queryv = `SELECT count(*) as numRows FROM experiencedetails WHERE status=1 AND ${searchbyfield} LIKE '%${search}%'`;
    } else if (search !== '' && searchbyfield === '') {
        queryv = `SELECT count(*) as numRows FROM experiencedetails WHERE status=1 AND user_id LIKE '%${search}%'`;
    } else {
        queryv = 'SELECT count(*) as numRows FROM experiencedetails WHERE status=1';
    }

    connection.query('SELECT count(*) as numRows FROM `experiencedetails` WHERE status=1', function (err, rows, fields) {
        try {

            if (err) {
                return res.status(200).json({ message: "Connection Query Error", status: 0 });
            } else {
                const numRows = rows[0].numRows;
                const numPages = Math.ceil(numRows / numPerPage);

                let q;
                if (search !== '' && searchbyfield !== '') {
                    q = `SELECT * FROM experiencedetails WHERE ${searchbyfield} LIKE '%${search}%' AND status=1 ORDER BY ${sortByfield} ${sort} LIMIT ${limit} OFFSET ${skip}`;
                }
                else if (search !== '' && searchbyfield == '') {
                    q = `SELECT * FROM experiencedetails WHERE user_id LIKE '%${search}%' AND status=1 ORDER BY ${sortByfield} ${sort} LIMIT ${limit} OFFSET ${skip}`;
                }
                else {
                    q = `SELECT * FROM experiencedetails WHERE status=1 ORDER BY ${sortByfield} ${sort} LIMIT ${limit} OFFSET ${skip}`;
                }

                connection.query(q, function (err, rows, fields) {

                    if (err) {
                        return res.status(200).json([]);
                    }

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
                        .catch(err => {
                            return res.status(200).json([]);
                        });
                });
            }
        }
        catch (error) {
            return res.status(500).json({ message: "Internal Server Error " });
        }
    });
}
