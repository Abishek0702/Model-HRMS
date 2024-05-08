const moment = require('moment');
import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
    get: getById,
    put: update,
    delete: _delete,
});

// get employee bank details by particular id
function getById(req, res) {

    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied" }) }

    const user_id = req.query.id;
    connection.query('SELECT * FROM `bankdetails` WHERE `user_id`=? AND `status`=1', [user_id], (err, results) => {
        const data = JSON.parse(JSON.stringify(results));

        if (err) { return res.status(500).json({ error: 'Internal Server Error' }); }
        else if (typeof data[0] === 'undefined') { return res.status(200).json({ message: 'Employee bank details not found', status: 0 }); }
        else {
            const formatted_c = moment.utc(data[0].created).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
            const formatted_u = moment.utc(data[0].updated).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
            data[0].created = formatted_c;
            data[0].updated = formatted_u;
            return res.json(data[0]);
        }
    });
}


// Update employee bank details by particular id
function update(req, res) {
    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied" }) }
    const updatedTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    const updatedId = req.query.id;
    const { ...user } = req.body;

    connection.query('SELECT * FROM `bankdetails` WHERE `id`=? AND `status`=1', [updatedId], (err, result) => {
        if (result.length === 0) { return res.status(200).json({ message: 'Employee bank details not found', status: 1 }); }
        else {
            var val = JSON.parse(JSON.stringify(result));
            const updateQuery = 'UPDATE `bankdetails` SET `user_id`=?, `nameAsPerBankAccount`=?, `bankName`=?, `branchName`=?, `accountNumber`=?, `ifscCode`=?, `UAN`=?,`acknowledge`=?,`remarks`=?, `status`=?, `created`=?, `updated`=? WHERE `id`=?';

            if (typeof user.user_id !== "undefined" && user.user_id !== "") { var user_id = user.user_id; } else { var user_id = val[0].user_id; }
            if (typeof user.nameAsPerBankAccount !== "undefined" && user.nameAsPerBankAccount !== "") { var nameAsPerBankAccount = user.nameAsPerBankAccount; } else { var nameAsPerBankAccount = val[0].nameAsPerBankAccount; }
            if (typeof user.bankName !== "undefined" && user.bankName !== "") { var bankName = user.bankName; } else { var bankName = val[0].bankName; }
            if (typeof user.branchName !== "undefined" && user.branchName !== "") { var branchName = user.branchName; } else { var branchName = val[0].branchName; }
            if (typeof user.accountNumber !== "undefined" && user.accountNumber !== "") { var accountNumber = user.accountNumber; } else { var accountNumber = val[0].accountNumber; }
            if (typeof user.ifscCode !== "undefined" && user.ifscCode !== "") { var ifscCode = user.ifscCode; } else { var ifscCode = val[0].ifscCode; }
            if (typeof user.UAN !== "undefined" && user.UAN !== "") { var UAN = user.UAN; } else { var UAN = val[0].UAN; }
            if (typeof user.acknowledge !== "undefined" && user.acknowledge !== "") { var acknowledge = user.acknowledge; } else { var acknowledge = val[0].acknowledge; }
            if (typeof user.remarks !== "undefined" && user.remarks !== "") { var remarks = user.remarks; } else { var remarks = val[0].remarks; }

            const values = [user_id, nameAsPerBankAccount, bankName, branchName, accountNumber, ifscCode, UAN,acknowledge,remarks, 1, updatedTime, updatedTime, updatedId];
            connection.query(updateQuery, values, (err, results) => {
                if (err) { return res.status(500).json({ error: 'Internal Server Error' }); }
                else { return res.status(200).json({ data: 'Employee bank details updated successfully', status: 1 }); }
            });
        }
    });
}


// delete employee bank details by particular id
function _delete(req, res) {
    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied" })}
    const id = req.query.id;

    connection.query('SELECT * FROM `bankdetails` WHERE `id`=? AND `status`=1', [id], (err, result) => {
        if (err) { return res.json({ Error: err.message }); }
        else if (typeof result[0] === 'undefined') { return res.status(200).json({ message: 'Employee bank details not found', status: 0 }); }
        else {
            const deleteQuery = 'UPDATE `bankdetails` SET `status`=0 WHERE `id`=? AND `status`=1';
            connection.query(deleteQuery, [id], function (error, result, fields) {
                if (error) { return res.status(200).json({ message: 'Failed to delete employee bank details', status: 0 }); }
                else { return res.json({ message: 'Employee bank details deleted successfully', status: 1 }); }
            });
        }
    });


}
