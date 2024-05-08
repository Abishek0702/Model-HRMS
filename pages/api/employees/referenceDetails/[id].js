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
    const id = req.query.id;
    connection.query('SELECT * FROM `referencedetails` WHERE `user_id`= ? AND status=1', [id], (err, results) => {
        const data = JSON.parse(JSON.stringify(results));

        if (err) { return res.status(500).json({ error: 'Internal Server Error' }); }
        else if (typeof data[0] === 'undefined') { return res.status(200).json({ message: ' details not found', status: 0 }); }
        else {
            const formatted_c = moment.utc(data[0].created).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
            const formatted_u = moment.utc(data[0].modified).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
            data[0].created = formatted_c;
            data[0].modified = formatted_u;
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

    connection.query('SELECT * FROM `referencedetails` WHERE `id`=? AND `status`=1', [updatedId], (err, result) => {
        if (result.length === 0) { return res.status(200).json({ message: 'Reference details not found', status: 1 }); }
        else {
            var val = JSON.parse(JSON.stringify(result));
            console.log("Val : ", val);

            if (typeof user.user_id !== "undefined" && user.user_id !== "") { var user_id = user.user_id; } else { var user_id = val[0].user_id; }
            if (typeof user.reportingpersonname !== "undefined" && user.reportingpersonname !== "") { var reportingpersonname = user.reportingpersonname; } else { var reportingpersonname = val[0].reportingpersonname; }
            if (typeof user.contactnumber !== "undefined" && user.contactnumber !== "") { var contactnumber = user.contactnumber; } else { var contactnumber = val[0].contactnumber; }
            if (typeof user.emailid !== "undefined" && user.emailid !== "") { var emailid = user.emailid; } else { var emailid = val[0].emailid; }
            if (typeof user.hrname !== "undefined" && user.hrname !== "") { var hrname = user.hrname; } else { var hrname = val[0].hrname; }
            if (typeof user.hrcontactnumber !== "undefined" && user.hrcontactnumber !== "") { var hrcontactnumber = user.hrcontactnumber; } else { var hrcontactnumber = val[0].hrcontactnumber; }
            if (typeof user.hremailid !== "undefined" && user.hremailid !== "") { var hremailid = user.hremailid; } else { var hremailid = val[0].hremailid; }
            if (typeof user.acknowledge !== "undefined" && user.acknowledge !== "") { var acknowledge = user.acknowledge; } else { var acknowledge = val[0].acknowledge; }
            if (typeof user.remarks !== "undefined" && user.remarks !== "") { var remarks = user.remarks; } else { var remarks = val[0].remarks; }

            const updateQuery = 'UPDATE `referencedetails` SET `user_id`=?,`reportingpersonname`=?,`contactnumber`=?,`emailid`=?,`hrname`=?,`hrcontactnumber`=?,`hremailid`=?,`acknowledge`=?,`remarks`=?, `modified`=? WHERE id=? ';
            const values = [user_id, reportingpersonname, contactnumber, emailid, hrname, hrcontactnumber, hremailid,acknowledge,remarks, updatedTime, updatedId];

            connection.query(updateQuery, values, (err, results) => {
                console.log("values : ", values);

                if (err) { return res.status(500).json({ error: 'Internal Server Error' }); }
                else {
                    return res.status(200).json({ data: 'Reference details updated successfully', status: 1 });
                }
            });
        }
    });
}


// delete employee bank details by particular id
function _delete(req, res) {
    // if (req.user.designation !== "admin") { res.status(200).json({ message: "Access Denied" })}
    const id = req.query.id;

    connection.query('SELECT * FROM `referencedetails` WHERE `id`=? AND `status`=1', [id], (err, result) => {
        if (err) { return res.json({ Error: err.message }); }
        else if (typeof result[0] === 'undefined') { return res.status(200).json({ message: 'Reference details not found', status: 0 }); }
        else {
            const deleteQuery = 'UPDATE `referencedetails` SET `status`=0 WHERE `id`=? AND `status`=1';
            connection.query(deleteQuery, [id], function (error, result, fields) {
                if (error) { return res.status(200).json({ message: 'Failed to delete employee bank details', status: 0 }); }
                else { return res.json({ message: 'Reference details deleted successfully', status: 1 }); }
            });
        }
    });
}
