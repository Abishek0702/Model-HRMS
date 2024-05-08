import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
import moment from 'moment';

export default apiHandler({
    get: getById,
    put: update,
    delete: _delete
});

// get family details by id
function getById(req, res) {
    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied" })};
    //'Father','Mother','Spouse','Brother','Sister','Children'
    const user_id = req.query.id;
    var query = `SELECT * FROM familydetails WHERE user_id=? AND status=1`;
    connection.query(query, [user_id], function (err, result) {
        if (err) {
            return res.status(200).json({ message: "connection Query Error" });
        } else {
            const data = JSON.parse(JSON.stringify(result))
            var Alldetails = []

            var familyDetails = data.filter(item => ['Father', 'Mother', 'Spouse'].includes(item.relationtype))
            var siblings = data.filter(item => ['Brother', 'Sister'].includes(item.relationtype))
            var childrens = data.filter(item => ['Children'].includes(item.relationtype))

            Alldetails.push({ familyDetails: familyDetails, siblings: siblings, childrens: childrens })

            return res.status(200).json({ post: Alldetails[0] })
        }
    })
}

// update family details
function update(req, res) {
    // if (req.user.designation !== "admin") { return res.status(200).json({ message: "access denined", status: 0 }); }
    const updatedId = req.query.id;
    const { ...user } = req.body;
    var updatedTime = moment.utc().format("YYYY-MM-DD HH:mm");

    connection.query("SELECT * FROM familydetails WHERE status=1 AND id=?", [updatedId], (err, result) => {
        console.log("Log : ", result);

        if (result.length == 0) { return res.status(200).json({ message: 'Educational details not found', status: 0 }); }
        else {
            var val = JSON.parse(JSON.stringify(result));
            if (typeof user.user_id !== "undefined" && user.user_id !== "") { var user_id = user.user_id; } else { var user_id = val[0].user_id; }
            if (typeof user.relationtype !== "undefined" && user.relationtype !== "") { var relationtype = user.relationtype; } else { var relationtype = val[0].relationtype }
            if (typeof user.name !== "undefined" && user.name !== "") { var name = user.name; } else { var name = val[0].name }
            if (typeof user.age !== "undefined" && user.age !== "") { var age = user.age; } else { var age = val[0].age }
            if (typeof user.dob !== "undefined" && user.dob !== "") { var dob = user.dob; } else { var dob = val[0].dob }
            if (typeof user.occupation !== "undefined" && user.occupation !== "") { var occupation = user.occupation; } else { var occupation = val[0].occupation }
            if (typeof user.contactnumber !== "undefined" && user.contactnumber !== "") { var contactnumber = user.contactnumber; } else { var contactnumber = val[0].contactnumber }
            if (typeof user.currentworkstatus !== "undefined" && user.currentworkstatus !== "") { var currentworkstatus = user.currentworkstatus; } else { var currentworkstatus = val[0].currentworkstatus }
            if (typeof user.maritalstatus !== "undefined" && user.maritalstatus !== "") { var maritalstatus = user.maritalstatus; } else { var maritalstatus = val[0].maritalstatus }
            if (typeof user.educationalqualification !== "undefined" && user.educationalqualification !== "") { var educationalqualification = user.educationalqualification; } else { var educationalqualification = val[0].educationalqualification }
            if (typeof user.residingin !== "undefined" && user.residingin !== "") { var residingin = user.residingin; } else { var residingin = val[0].residingin }
            if (typeof user.emergencycontactperson !== "undefined" && user.emergencycontactperson !== "") { var emergencycontactperson = user.emergencycontactperson; } else { var emergencycontactperson = val[0].emergencycontactperson }
            if (typeof user.acknowledge !== "undefined" && user.acknowledge !== "") { var acknowledge = user.acknowledge; } else { var acknowledge = val[0].acknowledge; }
            if (typeof user.remarks !== "undefined" && user.remarks !== "") { var remarks = user.remarks; } else { var remarks = val[0].remarks; }


            let q = "UPDATE `familydetails` SET `user_id`=?,`relationtype`=?, `name`=?,`age`=?,`dob`=?,`occupation`=?,`contactnumber`=?,`currentworkstatus`=?,`educationalqualification`=?,`maritalstatus`=?,`residingin`=?,`emergencycontactperson`=?,`acknowledge`=?,`remarks`=?,`status`=?,`modified`=? WHERE `id`=?";
            let dataUpdate = [user_id, relationtype, name, age, dob, occupation, contactnumber, currentworkstatus, educationalqualification, maritalstatus, residingin, emergencycontactperson, acknowledge, remarks, 1, updatedTime, updatedId];

            connection.query(q, dataUpdate, (err, result, fields) => {
                if (err) { return res.status(500).json({ error: 'DB error', details: err.message }); }
                else { return res.status(200).json({ message: 'Employee educational details updated successfully', status: 1, }); }
            });
        }
    });
}

// Delete family details
function _delete(req, res) {
    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied" }) }
    const id = req.query.id;
    connection.query('SELECT * FROM `familydetails` WHERE `id`=? and status=1', [id], (err, result) => {
        if (err) { res.json({ Error: err.message }); }
        else if (typeof result[0] == 'undefined') { res.status(200).json({ message: 'Family details not found', status: 0 }); }
        else {
            var deleleQuery = 'UPDATE `familydetails` SET `status`=0 WHERE `id`=?';
            connection.query(deleleQuery, [id], function (error, result, fields) {
                if (error) { return res.status(200).json({ message: 'failed to delete employee family details', status: 0 }); }
                else { return res.json({ message: 'Employee educational details deleted successfully', status: 1 }); }
            });
        }
    });
}

