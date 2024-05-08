import { apiHandler, usersRepo, omit } from "helpers/api";

const connection = require("helpers/api/routes/pool.js");
export default apiHandler({
  get: getUsers,
});

function getUsers(req, res) {
  // return users without hashed passwords in the response

  if (req.user.designation!="admin")
  return res.status(200).json({ data: "access denined", status: 0 }); 

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
    "SELECT count(*) as numRows FROM users WHERE status=1",
    function (err, rows, fields) {
      if (err) {
        console.log("error: ", err);
        return res.status(200).json([]);
      } else {
        var numRows = rows[0].numRows;
        var numPages = Math.ceil(numRows / numPerPage);

        if (search != "") {
          // var q =
          //   'SELECT * FROM users where name like "%' +
          //   search +
          //   '%" order by id desc LIMIT ' +
          //   limit;
          var q =
            'SELECT `users`.*,d.designationName,dep.name as depname FROM `users` LEFT JOIN designations d ON d.id = users.designation_id LEFT JOIN departments dep ON dep.id = users.department_id  where users.name like "%' +
            search +
            '%" AND users.status=1  group by users.id  order by id DESC LIMIT ' +
            limit;
        } else {
          // var q = "SELECT * FROM users order by id desc LIMIT " + limit;
          var q =
            "SELECT `users`.*,d.designationName,dep.name as depname FROM `users` LEFT JOIN designations d ON d.id = users.designation_id LEFT JOIN departments dep ON dep.id = users.department_id WHERE users.status=1 group by users.id order by id DESC LIMIT " +
            limit;
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
            var promises = [];
            for (var i = 0; i < data.length; i++) {
             
              if (data[i].fathersname == null) {  data[i].fathersname = "";     }
              if (data[i].first_name == null) {
                data[i].first_name = "";
              }
              if (data[i].last_name == null) {
                data[i].last_name = "";
              }
              if (data[i].address == null) {
                data[i].address = "";
              }
              if (data[i].city == null) {
                data[i].city = "";
              }
              if (data[i].state == null) {
                data[i].state = "";
              }
              if (data[i].country == null) {
                data[i].country = "";
              }
              if (data[i].date_of_birth == null) {
                data[i].date_of_birth = "";
              }
              if (data[i].placeOfBirth == null) {
                data[i].placeOfBirth = "";
              }
              if (data[i].gender == null) {
                data[i].gender = "";
              }
              if (data[i].religion == null) {
                data[i].religion = "";
              }
              if (data[i].nationality == null) {
                data[i].nationality = "";
              }
              if (data[i].BloodGroup == null) {
                data[i].BloodGroup = "";
              }
              if (data[i].disability == null) {
                data[i].disability = "";
              }
              if (data[i].MaritalStatus == null) {
                data[i].MaritalStatus = "";
              }
              if (data[i].DateOfWedding == null) {
                data[i].DateOfWedding = "";
              }
              if (data[i].spouseName == null) {
                data[i].spouseName = "";
              }
              if (data[i].NumberOfChildren == null) {
                data[i].NumberOfChildren = "";
              }
              if (data[i].PermanentAddress == null) {
                data[i].PermanentAddress = "";
              }
              if (data[i].PermanentCity == null) {
                data[i].PermanentCity = "";
              }
              if (data[i].PermanentState == null) {
                data[i].PermanentState = "";
              }
              if (data[i].PermanentCountry == null) {
                data[i].PermanentCountry = "";
              }
              if (data[i].PermanentPinCode == null) {
                data[i].PermanentPinCode = "";
              }
              if (data[i].email_verified_at == null) {
                data[i].email_verified_at = "";
              }

              if (data[i].remember_token == null) {
                data[i].remember_token = "";
              }
              if (data[i].fathersname == null) {
                data[i].fathersname = "";
              }
              if (data[i].mothersname == null) {
                data[i].mothersname = "";
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
}
