import { apiHandler } from "helpers/api";

const connection = require("helpers/api/routes/pool.js");
export default apiHandler({
  get: getUsers,
});

function getUsers(req, res) {


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


  var skip = (page - 1) * numPerPage;
  var limit = skip + "," + numPerPage;
  connection.query(
    "SELECT count(*) as numRows FROM users WHERE status=1",
    function (err, rows, fields) {
      if (err) {
        console.log("error: ", err);
        return res.status(200).json([]);
      } else {
        var numRows = rows[0].numRows;
        var numPages = Math.ceil(numRows / numPerPage);

        if (search != "") {
        
          var q =
          `SELECT leavemanagements.*, designations.id
          FROM leavemanagements
          JOIN designations ON leavemanagements.designationId = designations.id
          WHERE name LIKE  "%'+search+'%" AND leavemanagements.status = 1
          GROUP BY leavemanagements.id
          ORDER BY leavemanagements.id DESC LIMIT ` + limit
        } else {
          
          var q =
          "SELECT users.id, users.name, users.designation_id, designations.designationName FROM `users` LEFT JOIN `designations` designations ON users.designation_id = designations.id WHERE users.department_id <=4 ORDER BY id DESC LIMIT "+limit
        }
       // console.log("q: ", q);

        connection.query(q, function (err, rows, fields) {
          const data = Object.values(JSON.parse(JSON.stringify(rows)));
         // console.log("datasss:", data);
          if (err) {
            console.log("error: ", err);
            return res.status(200).json([]);
          } else {
    
            var promises = [];
            for (var i = 0; i < data.length; i++) {
              // if (data[i].designation_id == 4) {
              //   data[i].rolename = "user";
              // } else if (data[i].designation_id == 3) {
              //   data[i].rolename = "Manager";
              // } else if (data[i].designation_id == 2) {
              //   data[i].rolename = "HR";
              // } else if (data[i].designation_id == 1) {
              //   data[i].rolename = "Admin";
              // }
              
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
}

