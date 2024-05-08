
import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
const moment = require("moment")

export default apiHandler({
  get: getuserlist
});

function getuserlist(req, res) {

  if (typeof req.query.size !== "undefined") { var numPerPage = req.query.size } else { var numPerPage = 6 }
  if (typeof req.query.page !== "undefined") { var page = req.query.page } else { var page = 1 }
  if (typeof req.query.id !== "undefined") { var id = req.query.id }


  //start
  var skip = (page - 1) * numPerPage;
  var limit = skip + ',' + numPerPage;
  if (id != "") {
    var v = ` SELECT COUNT(*) as numRows FROM helpdesk WHERE helpdesk.id = ${id} and status = 1`

  } else {
    var v =
      ' SELECT COUNT(*) as numRows FROM helpdesk WHERE status = 1'
  }

  connection.query(v, function (err, rows, fields) {
    if (err) {
      console.log("error: ", err);
      res.status(500).json([]);
    } else {
      var numRows = rows[0].numRows;
      var numPages = Math.ceil(numRows / numPerPage);

      if (id != "") {
        var q =
          `SELECT helpdesk.id, helpdesk.type_id as type_id,helpdesk_types.iconname,helpdesk_types.iconcolor, helpdesk_types.name as typename, helpdesk.employee_description,helpdesk.approved_description, helpdesk.created,helpdesk.modified, helpdesk.helpstatus_id, helpdesk_status.name as statusName FROM helpdesk LEFT JOIN helpdesk_types on helpdesk_types.id = helpdesk.type_id LEFT JOIN helpdesk_status ON helpdesk_status.id = helpdesk.helpstatus_id WHERE helpdesk.id =${id} and helpdesk.status = 1 ORDER BY helpdesk.id desc LIMIT ${limit} `;
      } else {
        var q =
          `SELECT helpdesk.id, helpdesk.type_id as type_id,helpdesk_types.iconname,helpdesk_types.iconcolor, helpdesk_types.name as typename, helpdesk.employee_description,helpdesk.approved_description, helpdesk.created,helpdesk.modified, helpdesk.helpstatus_id, helpdesk_status.name as statusName FROM helpdesk LEFT JOIN helpdesk_types on helpdesk_types.id = helpdesk.type_id LEFT JOIN helpdesk_status ON helpdesk_status.id = helpdesk.helpstatus_id WHERE helpdesk.status = 1 ORDER BY helpdesk.id desc LIMIT ${limit} `;
      }

      connection.query(q, function (err, rows, fields) {
        if (err) {
          console.log("error: ", err);
          res.status(500).json([]);
        }

        else {
          const data = Object.values(JSON.parse(JSON.stringify(rows)));
          // console.log("data", data);
          var currentdate = moment().utcOffset("+5:30")
          var datas = []

          for (var i = 0; i < data.length; i++) {

            var createdDate = moment(data[i].created).utcOffset("+05:30")
            var modifiedDate = moment(data[i].modified).utcOffset("+05:30")

            if (typeof data[i].type_id != "undefined") {
              var tid = data[i].type_id;
              data[i].type_id = { "value": tid, "label": data[i].typename }
            } else { data[i].type_id = { "value": 0, "label": 0 } }

            if (typeof data[i].helpstatus_id != "undefined") {
              var sid = data[i].helpstatus_id;
              data[i].helpstatus_id = { "value": sid, "label": data[i].statusName }
            } else { data[i].helpstatus_id = { "value": 0, "label": 0 } }

            if (typeof data[i].helpstatus_id.value == 1) {
              var diffInDays = currentdate.diff(createdDate, "days")
              data[i].diffduration = diffInDays >= 1 ? diffInDays + " days ago" : "today"
            }
            if (typeof data[i].helpstatus_id.value == 2) {
              var diffInDays = currentdate.diff(modifiedDate, "days")
              data[i].modified_diff_duration = diffInDays >= 1 ? diffInDays + " days ago" : "today"
            }
            datas.push(data[i])

          }

          return res.status(200).json({
            numRows: numRows,
            numPages: numPages,
            page: page,
            limit: limit,
            posts: datas,
          });
        }
      });
    }
  });
}





