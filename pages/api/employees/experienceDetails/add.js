import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
const moment = require('moment');

export default apiHandler({
    post: addExperiencedetails
});

function addExperiencedetails(req, res) {
    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied", status: 0 })}
    var { user_id, relevanttype, type_experience, relevantExperience, companyname, department, designation, fromDate, toDate, ctc } = req.body;
    const currTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');

    var relevanttype = relevanttype || " ";
    var type_experience = type_experience || " ";
    var relevantExperience = relevantExperience || " ";
    var companyname = companyname || " ";
    var department = department || " ";
    var designation = designation || " ";
    var fromDate = fromDate || " ";
    var toDate = toDate || " ";
    var ctc = ctc || " ";

    connection.query('SELECT * FROM experiencedetails WHERE status=1', [user_id], async (error, result) => {
        if (error) { res.status(500).json({ error: 'Internal Server Error' }); }
        else {
            const query = ` INSERT INTO experiencedetails ( id, user_id, relevanttype, type_experience, relevantExperience, companyname, department, designation, fromDate, toDate, ctc, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            const values = [ null, user_id, relevanttype, type_experience, relevantExperience, companyname, department, designation, fromDate, toDate, ctc, 1, currTime, currTime];

            connection.query(query, values, (err, results) => {
                if (err) { return res.status(500).json({ error: 'DB error', details: err.message }); } 
                else { return res.status(200).json({ data: 'Employee experience details added successfully', status: 1 }); }
            });
        }

    });
}


