const moment = require('moment');
import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
    get: getById,
    put: update,
    delete: _delete
});

// get employee personal ids by particular id
function getById(req, res) {
    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied" }) }
    const user_id = req.query.id;
    connection.query('SELECT * FROM `personalid` WHERE `user_id`=? AND `status`=1', [user_id], (err, results) => {
        const data = JSON.parse(JSON.stringify(results));

        if (err) { return res.status(500).json({ error: 'Internal Server Error' }); }
        else if (typeof data[0] === 'undefined') { return res.status(200).json({ message: 'Employee personal ids not found', status: 0 }); }
        else {
            if (data[0].licenseValidity !== "0000-00-00" || data[0].passportIssueDate !== "0000-00-00" || data[0].passportExpiryDate !== "0000-00-00") {
                var formatted_lvd = moment.utc(data[0].licenseValidity).utcOffset('+05:30').format('YYYY-MM-DD');
                var formatted_pid = moment.utc(data[0].passportIssueDate).utcOffset('+05:30').format('YYYY-MM-DD');
                var formatted_ped = moment.utc(data[0].passportExpiryDate).utcOffset('+05:30').format('YYYY-MM-DD');
                var formatted_ca = moment.utc(data[0].created_at).utcOffset('+05:30').format('YYYY-MM-DD');
                var formatted_ua = moment.utc(data[0].updated_at).utcOffset('+05:30').format('YYYY-MM-DD');
            }
            else {
                var formatted_lvd = "-";
                var formatted_pid = "-";
                var formatted_ped = "-";
                formatted_ca = moment.utc(data[0].created_at).utcOffset('+05:30').format('YYYY-MM-DD');
                formatted_ua = moment.utc(data[0].updated_at).utcOffset('+05:30').format('YYYY-MM-DD');
            }
            data[0].licenseValidity = formatted_lvd;
            data[0].passportIssueDate = formatted_pid;
            data[0].passportExpiryDate = formatted_ped;
            data[0].created_at = formatted_ca;
            data[0].updated_at = formatted_ua;
            return res.json(data[0]);
        }
    });
}





// Update personalid by particular id
function update(req, res) {
    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied" }) }
    const updatedId = req.query.id;
    const { ...user } = req.body;
    const updatedTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');

    connection.query('SELECT * FROM `personalid` WHERE `id`=? AND `status`=1', [updatedId], (err, result) => {
        if (result.length == 0) { return res.status(200).json({ message: 'Personalids not found', status: 0 }); }
        else {
            var val = JSON.parse(JSON.stringify(result));

            if (typeof user.user_id !== "undefined" && user.user_id !== "") { var user_id = user.user_id; } else { var user_id = val[0].user_id; }
            if (typeof user.aadharCardNumber !== "undefined" && user.aadharCardNumber !== "") { var aadharCardNumber = user.aadharCardNumber; } else { var aadharCardNumber = val[0].aadharCardNumber }
            if (typeof user.panCardNumber !== "undefined" && user.panCardNumber !== "") { var panCardNumber = user.panCardNumber; } else { var panCardNumber = val[0].panCardNumber }
            if (typeof user.drivingLicenseNumber !== "undefined" && user.drivingLicenseNumber !== "") { var drivingLicenseNumber = user.drivingLicenseNumber; } else { var drivingLicenseNumber = val[0].drivingLicenseNumber }
            if (typeof user.licenseValidity !== "undefined" && user.licenseValidity !== "") { var licenseValidity = user.licenseValidity; } else { var licenseValidity = val[0].licenseValidity }
            if (typeof user.vehicleNumber !== "undefined" && user.vehicleNumber !== "") { var vehicleNumber = user.vehicleNumber; } else { var vehicleNumber = val[0].vehicleNumber }
            if (typeof user.passportNumber !== "undefined" && user.passportNumber !== "") { var passportNumber = user.passportNumber; } else { var passportNumber = val[0].passportNumber }
            if (typeof user.passportIssueDate !== "undefined" && user.passportIssueDate !== "") { var passportIssueDate = user.passportIssueDate; } else { var passportIssueDate = val[0].passportIssueDate }
            if (typeof user.passportExpiryDate !== "undefined" && user.passportExpiryDate !== "") { var passportExpiryDate = user.passportExpiryDate; } else { var passportExpiryDate = val[0].passportExpiryDate }
            if (typeof user.employeeLinkdinId !== "undefined" && user.employeeLinkdinId !== "") { var employeeLinkdinId = user.employeeLinkdinId; } else { var employeeLinkdinId = val[0].employeeLinkdinId }
            if (typeof user.employeeSocialMediaHandles !== "undefined" && user.employeeSocialMediaHandles !== "") { var employeeSocialMediaHandles = user.employeeSocialMediaHandles; } else { var employeeSocialMediaHandles = val[0].employeeSocialMediaHandles }
            if (typeof user.acknowledge !== "undefined" && user.acknowledge !== "") { var acknowledge = user.acknowledge; } else { var acknowledge = val[0].acknowledge; }
            if (typeof user.remarks !== "undefined" && user.remarks !== "") { var remarks = user.remarks; } else { var remarks = val[0].remarks; }

            const updateQuery = 'UPDATE `personalid` SET `user_id`=?, `aadharCardNumber`=?, `panCardNumber`=?, `drivingLicenseNumber`=?, `licenseValidity`=?, `vehicleNumber`=?, `passportNumber`=?,`passportIssueDate`=?, `passportExpiryDate`=?, `employeeLinkdinId`=?, `employeeSocialMediaHandles`=?,`acknowledge`=?,`remarks`=?, `updated_at`=? WHERE `id`=?';
            const values = [user_id, aadharCardNumber, panCardNumber, drivingLicenseNumber, licenseValidity, vehicleNumber, passportNumber, passportIssueDate, passportExpiryDate, employeeLinkdinId, employeeSocialMediaHandles,acknowledge,remarks, updatedTime, updatedId];

            connection.query(updateQuery, values, (err, results) => {
                if (err) { return res.status(500).json({ error: 'DB error', details: err.message }); }
                else { return res.status(200).json({ data: 'Employee personal ids updated successfully', status: 1 }); }
            });
        }
    });
}


// deletepersonalid by particular id
function _delete(req, res) {
    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied" }) }
    const id = req.query.id;
    connection.query('SELECT * FROM `personalid` WHERE `id`=? AND `status`=1', [id], (err, result) => {
        if (err) { return res.json({ Error: err.message }); }
        else if (typeof result[0] === 'undefined') { return res.status(200).json({ message: 'Employee personal details not found', status: 0 }); }
        else {
            connection.query('UPDATE `personalid` SET `status`=0 WHERE `id`=? AND `status`=1', [id], function (error, result, fields) {
                if (error) { return res.status(200).json({ message: 'Failed to delete employee personal details', status: 0 }); }
                else { return res.json({ message: 'Employee personal ids deleted successfully', status: 1 }); }
            });
        }
    });
}

