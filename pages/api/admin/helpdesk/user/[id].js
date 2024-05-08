
import { apiHandler } from 'helpers/api';
const moment = require('moment')
const connection = require('helpers/api/routes/pool.js');

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

  var v =
    ' SELECT COUNT(*) as numRows FROM helpdesk WHERE user_id = ' + id + ' AND status = 1'


  connection.query(v, function (err, rows, fields) {
    if (err) {
      console.log("error: ", err);
      res.status(500).json([]);
    } else {
      var numRows = rows[0].numRows;
      var numPages = Math.ceil(numRows / numPerPage);

      var q =
        `SELECT helpdesk.id, helpdesk.type_id as type_id, helpdesk_types.name as typename, 
        helpdesk.employee_description,helpdesk.approved_description,helpdesk.created,helpdesk.modified,
        helpdesk.helpstatus_id,helpdesk_status.name as statusName,helpdesk_types.iconname,helpdesk_types.iconcolor 
        FROM helpdesk 
        LEFT JOIN helpdesk_types on helpdesk_types.id = helpdesk.type_id 
        LEFT JOIN helpdesk_status ON helpdesk_status.id = helpdesk.helpstatus_id 
        WHERE user_id = ${id} AND helpdesk.status = 1 ORDER BY helpdesk.id DESC LIMIT ${limit} `;


      connection.query(q, function (err, rows, fields) {
        console.log("rows",rows);
        if (err) {
          console.log("error: ", err);
          res.status(500).json([]);
        } 
         
        else {
          const data = Object.values(JSON.parse(JSON.stringify(rows)));
          // console.log("data", data);

          var datas = []
          var currentdate = moment().utcOffset("+5:30").format("YYYY-MM-DD")
          for (var i = 0; i < data.length; i++) {

            
            if (typeof data[i].type_id != "undefined") {
              var tid = data[i].type_id;
              data[i].type_id = { "value": tid, "label": data[i].typename }
            } else { data[i].type_id = { "value": 0, "label": 0 } }

            if (typeof data[i].helpstatus_id != "undefined") {
              var sid = data[i].helpstatus_id;
              data[i].helpstatus_id = { "value": sid, "label": data[i].statusName }
            } else { data[i].helpstatus_id = { "value": 0, "label": 0 } }

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





