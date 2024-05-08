import { apiHandler, omit } from 'helpers/api';
const moment = require('moment')
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
  get: getadminList
});


function getadminList(req, res) {

  if (req.user.designation !== "admin") { return res.status(200).json({ message: "User Access Denied", status: 0 }) }

  if (typeof req.query.size !== "undefined") { var numPerPage = req.query.size } else { var numPerPage = 6 }
  if (typeof req.query.page !== "undefined") { var page = req.query.page } else { var page = 1 }
  if (typeof req.query.search !== "undefined") { var search = req.query.search } else { var search = "" }


  var skip = (page - 1) * numPerPage;
  var limit = numPerPage;

  if (search !== "") {
    var cq = `SELECT COUNT(*) as numRows FROM helpdesk WHERE helpdesk.helpstatus_id='${search}' and status = 1`;
  }
  else {
    var cq = `SELECT COUNT(*) as numRows FROM helpdesk WHERE status = 1`;
  }

  connection.query(cq, function (err, rows, fields) {

    if (err) {
      console.log("error: ", err);
      res.status(200).json({ message: "Connection Query Error", status: 0 });
    } else {
      const numRows = rows[0].numRows;
      const numPages = Math.ceil(numRows / numPerPage);


      if (search !== "") {
        var q = `SELECT helpdesk.id, users.name as userName, users.employeeID,helpdesk.employee_description, helpdesk.type_id as type_id,helpdesk_types.name as typename ,helpdesk_types.iconname,helpdesk_types.iconcolor,helpdesk.helpstatus_id as helpstatus_id,helpdesk_status.name as statusName,helpdesk.created,helpdesk.modified FROM helpdesk LEFT JOIN helpdesk_types on helpdesk_types.id = helpdesk.type_id LEFT JOIN helpdesk_status ON helpdesk_status.id = helpdesk.helpstatus_id LEFT JOIN users ON users.id = helpdesk.user_id LEFT JOIN designations ON designations.id =helpdesk.approver_id WHERE helpdesk.status = 1 AND helpdesk.helpstatus_id like '${search}%' ORDER BY helpdesk.id DESC LIMIT ${limit} OFFSET ${skip}`;
      } else {
        var q = `SELECT helpdesk.id, users.name as userName, users.employeeID,helpdesk.employee_description, helpdesk.type_id as type_id,helpdesk_types.name as typename ,helpdesk_types.iconname,helpdesk_types.iconcolor,helpdesk.helpstatus_id as helpstatus_id,helpdesk_status.name as statusName,helpdesk.created,helpdesk.modified FROM helpdesk LEFT JOIN helpdesk_types on helpdesk_types.id = helpdesk.type_id LEFT JOIN helpdesk_status ON helpdesk_status.id = helpdesk.helpstatus_id LEFT JOIN users ON users.id = helpdesk.user_id LEFT JOIN designations ON designations.id =helpdesk.approver_id WHERE helpdesk.status = 1 ORDER BY helpdesk.id DESC 
          LIMIT ${limit} OFFSET ${skip}`;
      }

      connection.query(q, function (err, rows, fields) {
        if (err) {
          console.log("error: ", err);
          res.status(500).json([]);
        } else {

          const data = JSON.parse(JSON.stringify(rows));
          var currentdate = moment().utcOffset("+5:30")
          const promises = [];
          for (let i = 0; i < data.length; i++) {

            var createdDate = moment(data[i].created).utcOffset("+05:30")
            var modifiedDate = moment(data[i].modified).utcOffset("+05:30")

            

          //  data[i].modified = moment(data[i].modified).format('YYYY-MM-DD hh:mm:ss');


            if (typeof data[i].type_id != "undefined") {
              var tid = data[i].type_id;
              data[i].type_id = { "value": tid, "label": data[i].typename }
            } else { data[i].type_id = { "value": 0, "label": 0 } }

            if (typeof data[i].helpstatus_id != "undefined") {
              var sid = data[i].helpstatus_id;
              data[i].helpstatus_id = { "value": sid, "label": data[i].statusName }
            } else { data[i].helpstatus_id = { "value": 0, "label": 0 } }

            if (data[i].helpstatus_id.value == 1) {
              var diffInDays = currentdate.diff(createdDate, "days")
              data[i].diffduration = diffInDays >= 1 ? diffInDays + " days ago" : "today"
            }
            if (data[i].helpstatus_id.value == 2) {
              var diffInDays = currentdate.diff(modifiedDate, "days")
              data[i].modified_diff_duration = diffInDays >= 1 ? diffInDays + " days ago" : "today"
            }
            promises.push(data[i]);
          }


          Promise.all(promises)
            .then(function (resp) {
              return res.status(200).json({
                numRows: numRows,
                numPages: numPages,
                page: page,
                limit: limit,
                posts: data
              });
            })

        }
      })
    }
  });
}
