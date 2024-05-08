const moment = require('moment');
import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
    get: getById,
    put: update,
    delete: _delete,
});

// get employee Experience details gy particular id
function getById(req, res) {
    const id = req.query.id;
    if (typeof id !== "undefined") {
        const fetchAsyncData = async (user_id) => {
            const expDetails = new Promise((resolve, reject) => {

                connection.query('SELECT * FROM `experiencedetails` WHERE `user_id`=? and status=1', [user_id], (err, results) => {
                    const data = Object.values(JSON.parse(JSON.stringify(results)));
                    if (err) { return res.status(200).json([]); }
                    else {
                        let experiencedetails = []
                        for (let i = 0; i < data.length; i++) {
                            const from_date = moment.utc(data[i].fromDate).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                            const to_date = moment.utc(data[i].toDate).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                            const created_at = moment.utc(data[i].created_at).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                            const updated_at = moment.utc(data[i].updated_at).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');

                            data[i].fromDate = from_date;
                            data[i].toDate = to_date;
                            data[i].created_at = created_at;
                            data[i].updated_at = updated_at;
                            experiencedetails.push(data[i]);
                        }
                        resolve(experiencedetails);
                    }
                });
            });

            const summaryData = new Promise((resolve, reject) => {
                let Countquery = `SELECT user_id,
                SUM(CASE WHEN relevanttype = 'IT' THEN type_experience ELSE 0 END) AS totalItExperience,
                SUM(CASE WHEN relevanttype <> 'IT' THEN type_experience ELSE 0 END) AS totalNonItExperience,
                SUM(type_experience) AS totalYearsOfExperience,
                SUM(relevantExperience) AS relevantExperience,
                COUNT(companyname) AS noOfCompaniesWorked
                FROM experiencedetails
                WHERE user_id = ${user_id} AND status=1
                GROUP BY user_id;`

                connection.query(Countquery, function (err, results, fields) {
                    const data = JSON.parse(JSON.stringify(results));
                    if (err) { return res.status(200).json([]); }
                    else { resolve(data[0]) }
                });
            });
            const [posts, summary] = await Promise.all([expDetails, summaryData]);
            return res.status(200).json({ posts, summary });
        };
        fetchAsyncData(id);
    }
    else {
        return res.status(200).json([]);
    }
}




// Update employee experience details gy particular id
function update(req, res) {
    const updatedId = req.query.id;
    const { ...user } = req.body;
    const updatedTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');

    connection.query('SELECT * FROM `experiencedetails` WHERE `id`=? AND `status`=1', [updatedId], (err, result) => {
        var val = JSON.parse(JSON.stringify(result));
        if (err) {
            res.status(500).json({ error: 'DB error', details: err.message });
        }
       else if (result.length == 0) { return res.status(200).json({ message: 'Experience details not found', status: 0 }); }
        else {
            if (typeof user.user_id !== "undefined" && user.user_id !== "") { var user_id = user.user_id; } else { var user_id = val[0].user_id; }
            if (typeof user.relevanttype !== "undefined" && user.relevanttype !== "") { var relevanttype = user.relevanttype; } else { var relevanttype = val[0].relevanttype; }
            if (typeof user.type_experience !== "undefined" && user.type_experience !== "") { var type_experience = user.type_experience; } else { var type_experience = val[0].type_experience; }
            if (typeof user.relevantExperience !== "undefined" && user.relevantExperience !== "") { var relevantExperience = user.relevantExperience; } else { var relevantExperience = val[0].relevantExperience; }
            if (typeof user.companyname !== "undefined" && user.companyname !== "") { var companyname = user.companyname; } else { var companyname = val[0].companyname; }
            if (typeof user.department !== "undefined" && user.department !== "") { var department = user.department; } else { var department = val[0].department; }
            if (typeof user.designation !== "undefined" && user.designation !== "") { var designation = user.designation; } else { var designation = val[0].designation; }
            if (typeof user.fromDate !== "undefined" && user.fromDate !== "") { var fromDate = user.fromDate; } else { var fromDate = val[0].fromDate; }
            if (typeof user.toDate !== "undefined" && user.toDate !== "") { var toDate = user.toDate; } else { var toDate = val[0].toDate; }
            if (typeof user.ctc !== "undefined" && user.ctc !== "") { var ctc = user.ctc; } else { var ctc = val[0].ctc; }
            if (typeof user.acknowledge !== "undefined" && user.acknowledge !== "") { var acknowledge = user.acknowledge; } else { var acknowledge = val[0].acknowledge; }
            if (typeof user.remarks !== "undefined" && user.remarks !== "") { var remarks = user.remarks; } else { var remarks = val[0].remarks; }

            const updateQuery = 'UPDATE `experiencedetails` SET `user_id`=?, `relevanttype`=?, `type_experience`=?, `relevantExperience`=?, `companyname`=?,`department`=?, `designation`=?, `fromDate`=?, `toDate`=?, `ctc`=?,`acknowledge`=?,`remarks`=?,`updated_at`=? WHERE `id`=?';
            // console.log("updateQuery : ", updateQuery);

            const values = [user_id, relevanttype, type_experience, relevantExperience, companyname, department, designation, fromDate, toDate, ctc,acknowledge,remarks, updatedTime, updatedId];
            // console.log("values : ", values);

            connection.query(updateQuery, values, (err, results) => {
                console.log("resultd",results);
                console.log("values : ", values);
                if (err) { return res.status(500).json({ error: 'DB error', details: err.message }); }
                else { return res.status(200).json({ data: 'Employee experience details updated successfully', status: 1 }); }
            });
        }
    });
}


function _delete(req, res) {
    const id = req.query.id;

    connection.query('SELECT * FROM `experiencedetails` WHERE `id`=? AND `status`=1', [id], (err, result) => {
        if (err) { return res.json({ Error: err.message }); }
        else if (typeof result[0] === 'undefined') { return res.status(200).json({ message: 'Employee experience details not found', status: 0 }); }
        else {
            connection.query('UPDATE `experiencedetails` SET `status`=0 WHERE `id`=? AND `status`=1', [id], function (error, result, fields) {
                if (error) { return res.status(200).json({ message: 'Failed to delete employee experience details', status: 0 }); }
                else { return res.json({ message: 'Employee experience details deleted successfully', status: 1 }); }
            });
        }
    });
}

