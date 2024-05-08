import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
const moment = require('moment');

export default apiHandler({
    post: addReferenceretails
});


function addReferenceretails(req, res) {
    const currTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var { user_id, reportingpersonname, contactnumber, emailid, hrname, hrcontactnumber, hremailid } = req.body;

    var user_id = user_id || "";
    var reportingpersonname = reportingpersonname || "";
    var contactnumber = contactnumber || "";
    var emailid = emailid || "";
    var hrname = hrname || "";
    var hrcontactnumber = hrcontactnumber || "";
    var hremailid = hremailid || "";

    // console.log("user_id : ", user_id); console.log("reportingpersonname : ", reportingpersonname); console.log("contactnumber : ", contactnumber); console.log("emailid : ", emailid); console.log("hrname : ", hrname); console.log("hrcontactnumber  :", hrcontactnumber); console.log("hremailid : ", hremailid);

    const insertQuery = `INSERT INTO referencedetails (id, user_id, reportingpersonname, contactnumber, emailid, hrname, hrcontactnumber, hremailid, status, created, modified) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [null, user_id, reportingpersonname, contactnumber, emailid, hrname, hrcontactnumber, hremailid, 1, currTime, currTime];

    connection.query(insertQuery, values, (err, results) => {
        if (err) { return res.status(500).json({ error: 'DB error', details: err.message }); }
        else { return res.status(200).json({ data: 'Reference Details added Successfully', status: 1 }); }
    });
}

