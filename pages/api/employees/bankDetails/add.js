import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
const moment = require('moment');

export default apiHandler({
    post: addBankdetails
});

function addBankdetails(req, res) {
    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied", status: 0 })}
    const currTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var { user_id, nameAsPerBankAccount, bankName, branchName, accountNumber, ifscCode, UAN } = req.body;

    var user_id = user_id || "";
    var nameAsPerBankAccount = nameAsPerBankAccount || "";
    var bankName = bankName || "";
    var branchName = branchName || "";
    var accountNumber = accountNumber || "";
    var ifscCode = ifscCode || "";
    var UAN = UAN || "";

    connection.query('SELECT * FROM bankdetails WHERE user_id = ? and status=1', [user_id], async (error, result) => {
        if (error) { res.status(500).json({ error: 'Internal Server Error' }); }
        else if (result && result.length > 0) { res.status(200).json({ message: 'Bank details already exists', status: 0 }); }
        else {
            const insertQuery = `INSERT INTO bankdetails (id, user_id, nameAsPerBankAccount, bankName, branchName, accountNumber, ifscCode, UAN, status, created, updated) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
            const values = [null, user_id, nameAsPerBankAccount, bankName, branchName, accountNumber, ifscCode, UAN, 1, currTime, currTime];

            connection.query(insertQuery, values, (err, results) => {
                if (err) { return res.status(500).json({ error: 'DB error', details: err.message });}
                else { return res.status(200).json({ data: 'Bank Details added Successfully', status: 1 });}
            });
        }
    });
}
