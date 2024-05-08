import { apiHandler, omit } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

import moment from 'moment';

export default apiHandler({
    get: getpersonalIds
});

function getpersonalIds(req, res) {

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
        queryv = `SELECT count(*) as numRows FROM personalid WHERE status=1 AND ${searchbyfield} LIKE '%${search}%'`;
    } else if (search !== '' && searchbyfield === '') {
        queryv = `SELECT count(*) as numRows FROM personalid WHERE status=1 AND user_id LIKE '%${search}%'`;
    } else {
        queryv = 'SELECT count(*) as numRows FROM personalid WHERE status=1';
    }

    connection.query(queryv, function (err, rows, fields) {
        try {
            if (err) {
                res.status(200).json({ message: "Connection Query Error", status: 0 });
            }
            else {
                const numRows = rows[0].numRows;
                const numPages = Math.ceil(numRows / numPerPage);

                let q;
                if (search !== '' && searchbyfield !== '') {
                    q = `SELECT * FROM personalid WHERE ${searchbyfield} LIKE '%${search}%' AND status=1 ORDER BY ${sortByfield} ${sort} LIMIT ${limit} OFFSET ${skip}`;
                }
                else if (search !== '' && searchbyfield == '') {
                    q = `SELECT * FROM personalid WHERE user_id LIKE '%${search}%' AND status=1 ORDER BY ${sortByfield} ${sort} LIMIT ${limit} OFFSET ${skip}`;
                }
                else {
                    q = `SELECT * FROM personalid WHERE status=1 ORDER BY ${sortByfield} ${sort} LIMIT ${limit} OFFSET ${skip}`;
                }

                connection.query(q, function (err, rows, fields) {
                    if (err) {
                        res.status(200).json({ message: "Main Query Error", status: 0 });
                    }

                    const data = JSON.parse(JSON.stringify(rows));

                    const promises = [];
                    for (let i = 0; i < data.length; i++) {

                        

                        var licenseValidity;
                        var passportIssueDate;
                        var passportExpiryDate;
                        var formatted_ca;
                        var formatted_ua;

                        if (data[i].licenseValidity !== "0000-00-00" || data[i].passportIssueDate !== "0000-00-00" || data[i].passportExpiryDate !== "0000-00-00") {
                            var formatted_lvd = moment.utc(data[i].licenseValidity).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                            var formatted_pid = moment.utc(data[i].passportIssueDate).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                            var formatted_ped = moment.utc(data[i].passportExpiryDate).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                            formatted_ca = moment.utc(data[i].created_at).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                            formatted_ua = moment.utc(data[i].updated_at).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                        }
                        else {
                            var formatted_lvd = moment.utc(data[i].licenseValidity).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                            var formatted_pid = moment.utc(data[i].passportIssueDate).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                            var formatted_ped = moment.utc(data[i].passportExpiryDate).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                            formatted_ca = moment.utc(data[i].created_at).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                            formatted_ua = moment.utc(data[i].updated_at).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                        }


                        data[i].licenseValidity = formatted_lvd;
                        data[i].passportIssueDate = formatted_pid;
                        data[i].passportExpiryDate = formatted_ped;
                        data[i].created_at = formatted_ca;
                        data[i].updated_at = formatted_ua;

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
