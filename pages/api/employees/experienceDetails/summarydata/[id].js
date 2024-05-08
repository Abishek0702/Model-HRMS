import { apiHandler, omit } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
    get: getDetails
});

function getDetails(req, res) {

    const numPerPage = parseInt(req.query.size) || 6;
    const page = parseInt(req.query.page) || 1;
    const id = parseInt(req.query.id);

    const skip = (page - 1) * numPerPage;
    const limit = numPerPage;

    // if (req.login_id !== "admin") {
    //     res.status(200).json({ message: "Access Denied" })
    // }

    connection.query('SELECT count(*) as numRows FROM `experiencedetails` WHERE status=1', function (err, rows, fields) {
        try {
            if (err) {
                return res.status(200).json({ message: "Connection Query Error", status: 0 });
            }
            else {
                const numRows = rows[0].numRows;
                const numPages = Math.ceil(numRows / numPerPage);

                let Countquery = `SELECT user_id,SUM(totalYearsOfExperience) AS totalYearsOfExperience, SUM(relevantExperience) AS relevantExperience, SUM(totalItExperience) AS totalItExperience, SUM(totalNonItExperience) AS totalNonItExperience
                FROM experiencedetails
                WHERE user_id=${id}
                GROUP BY user_id ;`

                connection.query(Countquery, function (err, rows, fields) {

                    console.log("query : ",);
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
