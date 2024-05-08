import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
import moment from 'moment';

export default apiHandler({
    get: getemployeemonth
});

function getemployeemonth(req, res) {

    const numPerPage = req.query.size || 6;
    const page = req.query.page || 1;
    const search = req.query.search || "";
    const sort = req.query.sort && req.query.sort.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const skip = (page - 1) * numPerPage;
    const limit = `${skip},${numPerPage}`;

    let cq;

    if (search != "") { cq = `SELECT count(*) AS numRows FROM employeeofmonth LEFT JOIN users ON users.id = employeeofmonth.user_id WHERE(users.name LIKE '${search}%' OR UPPER(DATE_FORMAT(employeeofmonth.month, '%M')= '${search}' OR DATE_FORMAT(employeeofmonth.month, '%m')= '${search}') ) AND employeeofmonth.status=1; ` }
    else {
        cq = `SELECT count(*) AS numRows FROM employeeofmonth WHERE employeeofmonth.status=1;`;
    }

    connection.query(cq, function (err, rows, fields) {

        try {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json({ message: "Connection Query Error", status: 0 });
            } else {
                const numRows = rows[0].numRows;
                const numPages = Math.ceil(numRows / numPerPage);

                let dataQuery;
                if (search != "") {
                     dataQuery = `SELECT e.id AS id, u.name, e.employee_id, DATE_FORMAT(e.month, '%m') AS display_month, DATE_FORMAT(e.month, '%Y-%m-%d') AS month, e.presenter_id, e.title, e.description FROM employeeofmonth AS e LEFT JOIN users AS u ON e.employee_id COLLATE utf8mb4_unicode_ci = u.employeeID COLLATE utf8mb4_unicode_ci WHERE (u.name LIKE '${search}%' OR UPPER(DATE_FORMAT(e.month, '%M') like '${search}%' OR DATE_FORMAT(e.month, '%m')= '${search}') ) AND e.status = 1 ORDER BY e.id ${sort} LIMIT ${limit}`; }
                else {
                    dataQuery = `SELECT e.id, u.name, e.employee_id, DATE_FORMAT(e.month, '%m') as display_month, DATE_FORMAT(e.month, '%Y-%m-%d') as month, e.presenter_id, e.title, e.description FROM employeeofmonth AS e LEFT JOIN users AS u ON e.employee_id COLLATE utf8mb4_unicode_ci = u.employeeID COLLATE utf8mb4_unicode_ci WHERE e.status = 1 ORDER BY e.id ${sort} LIMIT ${limit}`;
                }

                connection.query(dataQuery, function (err, rows, fields) {

                    if (err) {
                        console.log("error: ", err);
                        res.status(500).json([]);
                    } else {

                        const data = JSON.parse(JSON.stringify(rows));

                        Promise.all(data)
                            .then(function () {
                                return res.status(200).json({
                                    numRows: numRows,
                                    numPages: numPages,
                                    page: page,
                                    limit: limit,
                                    posts: data,

                                });
                            })

                            .catch(err => {
                                res.status(500).json([]);
                            });

                    }
                });
            }

        } catch (error) {
            console.log("JSON parsing error: ", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
}