import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
const moment = require('moment');

export default apiHandler({
    post: addpersonalids
});

function addpersonalids(req, res) {
    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied", status: 0 })}
    var { user_id, aadharCardNumber, panCardNumber, drivingLicenseNumber, licenseValidity, vehicleNumber, passportNumber, passportIssueDate, passportExpiryDate, employeeLinkdinId, employeeSocialMediaHandles } = req.body;
    const currTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');

    var aadharCardNumber = aadharCardNumber || " ";
    var panCardNumber = panCardNumber || " ";
    var drivingLicenseNumber = drivingLicenseNumber || " ";
    var licenseValidity = licenseValidity || " ";
    var vehicleNumber = vehicleNumber || " ";
    var passportNumber = passportNumber || " ";
    var passportIssueDate = passportIssueDate || " ";
    var passportExpiryDate = passportExpiryDate || " ";
    var employeeLinkdinId = employeeLinkdinId || " ";
    var employeeSocialMediaHandles = employeeSocialMediaHandles || " ";

    connection.query('SELECT * FROM personalid WHERE user_id = ? and status=1', [user_id], async (error, result) => {
        if (error) { res.status(500).json({ error: 'Internal Server Error' }); }
        else if (result && result.length > 0) { res.status(200).json({ message: 'Educational details already exists', status: 0 }); }
        else {
            const insertQuery = `INSERT INTO personalid (id, user_id, aadharCardNumber, panCardNumber, drivingLicenseNumber, licenseValidity, vehicleNumber, passportNumber, passportIssueDate, passportExpiryDate, employeeLinkdinId, employeeSocialMediaHandles, status, created_at, updated_at ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            const values = [null, user_id, aadharCardNumber, panCardNumber, drivingLicenseNumber, licenseValidity, vehicleNumber, passportNumber, passportIssueDate, passportExpiryDate, employeeLinkdinId, employeeSocialMediaHandles, 1, currTime, currTime];

            connection.query(insertQuery, values, (err, results) => {
                if (err) { return res.status(500).json({ error: 'DB error', details: err.message }); } 
                else { return res.status(200).json({ data: 'Personal Details added Successfully', status: 1 }); }
            });
        }
    });
}

