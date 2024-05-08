const moment = require('moment');
import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
    post: addEducationaldetails
});

function addEducationaldetails(req, res) {

    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied", status: 0 })}
    const currTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var { user_id, course, institutionname, university, specialization, percentage, yearofcompletion } = req.body;

    var user_id = user_id || "";
    var course = course || "";
    var institutionname = institutionname || "";
    var university = university || "";
    var specialization = specialization || "";
    var percentage = percentage || "";
    var yearofcompletion = yearofcompletion || "";

    connection.query('SELECT * FROM educationaldetails WHERE user_id = ? and course = ? and status=1', [user_id, course], async (error, result) => {
        if (error) { res.status(500).json({ error: 'Internal Server Error' }); }
        else if (result && result.length > 0) { res.status(200).json({ message: 'Educational details already exists', status: 0 }); }
        else {
            const insertQuery = `INSERT INTO educationaldetails (id, user_id, course, institutionname, university, specialization, percentage, yearofcompletion, status, created, updated) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
            const values = [null, user_id, course, institutionname, university, specialization, percentage, yearofcompletion, 1, currTime, currTime];

            connection.query(insertQuery, values, (err, results) => {
                if (err) { return res.status(500).json({ error: 'Internal server error', details: err.message }); }
                else { return res.status(200).json({ message: 'You have successfully added the educational details', status: 1 }); }
            });
        }
    });
}
