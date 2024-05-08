
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { apiHandler } = require("helpers/api");
const { usersRepo, omit } = require("helpers/api");
const connection = require("helpers/api/routes/pool.js");

export default apiHandler({
  get: getById,
});

function getById(req, res) {
  const id = req.query.id;
  const search = req.query.search || '';
  const numPerPage = req.query.size || 6;
  const page = req.query.page || 1;

  var skip = (page - 1) * numPerPage;
  var limit = skip + "," + numPerPage; 

  connection.query(
    "SELECT count(*) as numRows FROM policies WHERE status = 1",
    function (err, rows, fields) {
      if (err) {
        console.log("error: ", err);
        return res.status(200).json([]);
      } else {
        var numRows = rows[0].numRows;
        var numPages = Math.ceil(numRows / numPerPage);

        if (search != "") {
          var q = 'SELECT policies.id, policies.name, policies.path, user_policies.id as acknowledge FROM policies LEFT JOIN user_policies ON user_policies.policy_id = policies.id AND user_policies.user_id = ? WHERE policies.name LIKE ? AND policies.status = 1 GROUP BY policies.id, policies.name LIMIT ' + limit;
        } else {
          var q = 'SELECT policies.id, policies.name, policies.path, user_policies.id as acknowledge FROM policies LEFT JOIN user_policies ON user_policies.policy_id = policies.id AND user_policies.user_id = ? WHERE policies.status = 1 GROUP BY policies.id, policies.name LIMIT ' + limit;
        }
        console.log("q: ", q);

        connection.query(q, [id, `%${search}%`], function (err, rows, fields) {
          if (err) {
            console.log("error: ", err);
            return res.status(200).json([]);
          } else {
            const data = Object.values(JSON.parse(JSON.stringify(rows)));
            //console.log("data:", data);
            
            return res.status(200).json({
              numRows: numRows,
              numPages: numPages,
              page: page,
              limit: limit,
              posts: data,
            });
          }
        }); 
      }
    }
  );
}



