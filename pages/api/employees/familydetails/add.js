import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
const moment = require('moment');

export default apiHandler({
    post: addFamilydetails
});

async function addFamilydetails(req, res) {
    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied", status: 0 })}

    const currentTime = moment().utc().format('YYYY-MM-DD HH:mm');
    var { user_id, relationtype, name, age, dob, occupation, contactnumber, currentworkstatus, educationalqualification, maritalstatus, residingin, emergencycontactperson } = req.body;

    var name = name || "";
    var age = age || "";
    var dob = dob || "-";
    var occupation = occupation || "-";
    var contactnumber = contactnumber || "-";
    var currentworkstatus = currentworkstatus || "-";
    var educationalqualification = educationalqualification || "-";
    var maritalstatus = maritalstatus || "";
    var residingin = residingin || "";

    connection.query('SELECT * FROM familydetails WHERE status=1', async (error, result) => {
        if (error) { res.status(500).json({ error: 'Internal Server Error' }); }
        else {
            var insertQuery = 'INSERT INTO familydetails (id, user_id, relationtype, name, age, dob, occupation, contactnumber, currentworkstatus, educationalqualification, maritalstatus, residingin, emergencycontactperson, status, created, modified) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?)';
            var values = [null, user_id, relationtype, name, age, dob, occupation, contactnumber, currentworkstatus, educationalqualification, maritalstatus, residingin, emergencycontactperson, 1, currentTime, currentTime];
            connection.query(insertQuery, values, (err, results) => {
                if (err) { console.log('Error executing INSERT query:', err); return res.status(500).json({ error: 'Internal Server Error' }); }
                else { return res.status(200).json({ message: 'You have successfully added the family details', status: 1 }); }
            });
        }
    });
}