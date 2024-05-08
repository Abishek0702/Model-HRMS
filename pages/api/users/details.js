import { apiHandler, usersRepo, omit } from "helpers/api";
const moment = require("moment");
const connection = require("helpers/api/routes/pool.js");
export default apiHandler({
  get: getUsers,
});

function getUsers(req, res) {
  // return users without hashed passwords in the response
  console.log(req.user);


  var accessstatus = 0;

  if (req.user.designation == "admin") {
    accessstatus = 1;
  } else if (req.user.login_id == req.query.id) {
    accessstatus = 1;
  } else {
    console.log("fasdfa")
    return res.status(200).json([]);
  }


  if (typeof req.query.id !== "undefined") {




    var id = req.query.id;
    connection.query(
      "SELECT `users`.*,d.designationName ,dep.name as depname FROM `users` LEFT JOIN designations d ON d.id = users.designation_id  LEFT JOIN departments dep ON dep.id = users.department_id  where users.id = ? AND users.status=1  group by users.id",
      [id],
      function (error, results, fields) {
        const data = Object.values(JSON.parse(JSON.stringify(results)));
        // console.log("results-", data);
        if (error) {
          return res.status(200).json([]);
        } else {
          if (data[0].date_of_joining != "0000-00-00" && data[0].date_of_joining != null) { data[0].date_of_joining = moment(data[0].date_of_joining).utcOffset("+05:30").format('YYYY-MM-DD') }
          // if(data[0].DateOfWedding!="0000-00-00" && data[0].DateOfWedding!=null){ data[0].DateOfWedding=moment(data[0].DateOfWedding).format('YYYY-MM-DD') }
          if (data[0].date_of_birth != "0000-00-00" && data[0].date_of_birth != null) { data[0].date_of_birth = moment(data[0].date_of_birth).utcOffset("+05:30").format('YYYY-MM-DD') }


          return res.status(200).json(data[0]);
        }
      }
    );
  } else {
    return res.status(200).json([]);
  }
}
