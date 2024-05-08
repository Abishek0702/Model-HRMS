import { apiHandler, usersRepo, omit } from "helpers/api";
 
const jwt = require('jsonwebtoken')
import moment from 'moment'
import { serverRuntimeConfig } from 'next.config';
const connection = require('helpers/api/routes/pool.js')

export default apiHandler({
  get: getUsers,
});

function getUsers(req, res) {
  // return users without hashed passwords in the response

  if (req.user.login_id) {
    var login_id=req.user.login_id

  console.log("query---", req.query.page, req.query.size);

  if (typeof req.query.size !== "undefined") {
    var numPerPage = req.query.size;
  } else {
    var numPerPage = 6;
  }
  if (typeof req.query.page !== "undefined") {
    var page = req.query.page;
  } else {
    var page = 1;
  }
  if (typeof req.query.search !== "undefined") {
    var search = req.query.search;
  } else {
    var search = "";
  }

  //start
  var skip = (page - 1) * numPerPage;
  var limit = skip + "," + numPerPage; // Here we compute the LIMIT parameter for MySQL query
  connection.query(
    "SELECT count(*) as numRows FROM reports WHERE status=1 and user_id="+login_id,
    function (err, rows, fields) {
      if (err) {
        console.log("error: ", err);
        return res.status(200).json([]);
      } else {
        var numRows = rows[0].numRows;
        var numPages = Math.ceil(numRows / numPerPage);

        if (search != "") {
          var q = "SELECT *, reports.startTime AS InTime, reports.endTime AS OutTime FROM reports where   user_id="+login_id+" order by id desc LIMIT " + limit;
        } else {
           var q = "SELECT *, reports.startTime AS InTime, reports.endTime AS OutTime FROM reports where   user_id="+login_id+" order by id desc LIMIT " + limit;
          
        }
        console.log("q: ", q);

        connection.query(q, function (err, rows, fields) {
          const data = Object.values(JSON.parse(JSON.stringify(rows)));
          //console.log("datasss:", data);
          if (err) {
            console.log("error: ", err);
            return res.status(200).json([]);
          } else {
            //console.log(rows)
            //result(null, rows,numPages);
            //return res.status(200).json({numRows:numRows, numPages:numPages, page:page, limit:limit, posts: data});
            var promises = [];  var currentdate = moment().utcOffset("+05:30").format("YYYY-MM-DD");
            for (var i = 0; i < data.length; i++) {

              // moment(user.startTime).format('HH:MM')
              var date=data[i].startTime;
              data[i].startTime=moment(data[i].startTime).utcOffset("+05:30").format("hh:mm A");
              if(data[i].endTime){data[i].endTime=moment(data[i].endTime).utcOffset("+05:30").format("hh:mm A"); }else{ data[i].endTime="--"}
              data[i].createddate=moment(date).utcOffset("+05:30").format("YYYY-MM-DD");

              if (data[i].InTime !== null && data[i].OutTime !== null) {
                var Totalduration = moment(data[i].OutTime).utcOffset("+05:30").diff(moment(data[i].InTime).utcOffset("+5:30"), 'minutes');

                if (Totalduration >= (9 * 60)) { // Compare with 9 hours (9 * 60 minutes)
                    data[i].InTime = moment(data[i].InTime).utcOffset("+05:30").format("hh:mm A");
                    data[i].OutTime = moment(data[i].OutTime).utcOffset("+05:30").format("hh:mm A");
                    data[i].status = "Present";
                    data[i].TotalDuration = moment.utc(Totalduration * 60000).format("hh:mm"); // Convert minutes to hh:mm A format
                    data[i].date = req.query.date || currentdate
                } else {
                    data[i].InTime = moment(data[i].InTime).utcOffset("+05:30").format("hh:mm A");
                    data[i].OutTime = moment(data[i].OutTime).utcOffset("+05:30").format("hh:mm A");
                    data[i].status = "Partial";
                    data[i].TotalDuration = moment.utc(Totalduration * 60000).format("hh:mm");
                    data[i].date = req.query.date || currentdate
                }
            } else if (data[i].InTime !== null && data[i].OutTime == null) {
                data[i].InTime = moment(data[i].InTime).utcOffset("+05:30").format("hh:mm A");
                data[i].OutTime = "--:--";
                data[i].TotalDuration = "--:--"
                data[i].status = "Partial";
                data[i].date = req.query.date || currentdate
            } else if (data[i].InTime == null && data[i].OutTime == null) {
                data[i].InTime = "--:--";
                data[i].OutTime = "--:--";
                data[i].TotalDuration = "--:--"
                data[i].status = "Absent";
                data[i].date = req.query.date || currentdate
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
                  posts: data,
                });
              })
              .catch((err) => {
                return res.status(200).json([]);
              });
          }
        });
      }
    }
  );
  }else{
         
            return res.status(200).json([]);
  }
}
