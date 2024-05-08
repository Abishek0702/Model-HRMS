import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
const moment = require('moment');

export default apiHandler({
    get: getById,
    put: update,
    delete: _delete
});

// get employee educational details by particular id
function getById(req, res) {

    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied", status: 0 }) }

    const user_id = req.query.id;
    connection.query('SELECT * FROM `educationaldetails` WHERE `user_id`=? AND `status`=1', [user_id], (err, results) => {
        const data = Object.values(JSON.parse(JSON.stringify(results)));

        if (err) { return res.status(500).json({ error: 'Internal Server Error' }); }
        else if (typeof data[0] === 'undefined') { return res.status(200).json({ message: 'Employee educational details not found', status: 0 }); }
        else {
            let eduDetails = [];
            for (let i = 0; i < data.length; i++) {
                const formatted_c = moment.utc(data[i].created).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
                const formatted_u = moment.utc(data[i].updated).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');

                data[i].created = formatted_c;
                data[i].updated = formatted_u;
                eduDetails.push(data[i]);
            }
            return res.json(eduDetails);
        }
    });
}


// Update employee educational details by particular id

function update(req, res) {
    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied", status: 0 }) }
    const updatedId = req.query.id;
    const { ...user } = req.body;
    const updatedTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');

    connection.query('SELECT * FROM `educationaldetails` WHERE `id`=? AND `status`=1', [updatedId], (err, result) => {
        if (result.length == 0) { return res.status(200).json({ message: 'Educational details not found', status: 0 }); }
        else {
            var val = JSON.parse(JSON.stringify(result));

            if (typeof user.user_id !== "undefined" && user.user_id !== "") { var user_id = user.user_id; } else { var user_id = val[0].user_id; }
            if (typeof user.course !== "undefined" && user.course !== "") { var course = user.course; } else { var course = val[0].course }
            if (typeof user.institutionname !== "undefined" && user.institutionname !== "") { var institutionname = user.institutionname; } else { var institutionname = val[0].institutionname; }
            if (typeof user.university !== "undefined" && user.university !== "") { var university = user.university; } else { var university = val[0].university; }
            if (typeof user.specialization !== "undefined" && user.specialization !== "") { var specialization = user.specialization; } else { var specialization = val[0].specialization; }
            if (typeof user.percentage !== "undefined" && user.percentage !== "") { var percentage = user.percentage; } else { var percentage = val[0].percentage; }
            if (typeof user.yearofcompletion !== "undefined" && user.yearofcompletion !== "") { var yearofcompletion = user.yearofcompletion; } else { var yearofcompletion = val[0].yearofcompletion; }
            if (typeof user.acknowledge !== "undefined" && user.acknowledge !== "") { var acknowledge = user.acknowledge; } else { var acknowledge = val[0].acknowledge; }
            if (typeof user.remarks !== "undefined" && user.remarks !== "") { var remarks = user.remarks; } else { var remarks = val[0].remarks; }

            const updateQuery = 'UPDATE `educationaldetails` SET `user_id`=?, `course`=?, `institutionname`=?, `university`=?, `specialization`=?, `percentage`=?, `yearofcompletion`=?,`acknowledge`=?,`remarks`=?, `status`=?, `updated`=? WHERE `id`=?';
            const values = [user_id, course, institutionname, university, specialization, percentage, yearofcompletion,acknowledge,remarks, 1, updatedTime, updatedId];
            connection.query(updateQuery, values, (err, results) => {
                if (err) { return res.status(500).json({ error: 'Internal Server Error' }); }
                else { console.log("Results : ", results); return res.status(200).json({ data: 'Employee educational details updated successfully', status: 1 }); }
            });
        }
    });
}

// Delete employee educational details gy particular id
function _delete(req, res) {

    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied", status: 0 }) }
    const id = req.query.id;
    connection.query('SELECT * FROM `educationaldetails` WHERE `id`=? AND `status`=1', [id], (err, result) => {
        if (err) { return res.json({ Error: err.message }); }
        else if (typeof result[0] === 'undefined') { return res.status(200).json({ data: 'Employee educational details not found', status: 0 }); }
        else {
            const deleteQuery = 'UPDATE `educationaldetails` SET `status`=0 WHERE `id`=? AND `status`=1';
            connection.query(deleteQuery, [id], function (error, result, fields) {
                if (error) { return res.status(200).json({ data: 'Failed to delete employee educational details', status: 0 }); }
                else { return res.json({ data: 'Employee educational details deleted successfully', status: 1 }); }
            });
        }
    });
}