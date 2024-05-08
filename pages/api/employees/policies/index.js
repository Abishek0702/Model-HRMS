import { apiHandler, usersRepo, omit } from 'helpers/api';

const connection = require('helpers/api/routes/pool.js');
export default apiHandler({
  get: getStatuses
});

function getStatuses(req, res) {
  console.log('query---', req.query.page, req.query.size);

  if (typeof req.query.size !== 'undefined') { var numPerPage = req.query.size; } else { var numPerPage = 6; }
  if (typeof req.query.page !== 'undefined') { var page = req.query.page; } else { var page = 1; }
  if (typeof req.query.search !== 'undefined') { var search = req.query.search; } else { var search = "" }

  var skip = (page - 1) * numPerPage
  var limit = skip + ',' + numPerPage;

  connection.query('SELECT count(*) as numRows FROM policies where status !=0 ', function (err, rows, fields) {

    if (err) { console.log("error: ", err); return res.status(200).json([]); }
    else {
      var numRows = rows[0].numRows;
      var numPages = Math.ceil(numRows / numPerPage);

      if (search != "") {
        var q = 'SELECT id,name,description,path,status,created,modified FROM policies WHERE id LIKE "' + search + '"  and status!=0 ORDER BY id DESC LIMIT ' + limit;
      } else {
        var q = 'SELECT id,name,description,path,status,created,modified FROM policies where status !=0 ORDER BY id DESC LIMIT ' + limit;
      }
      console.log("q: ", q);

      connection.query(q, function (err, rows, fields) {
        const data = Object.values(JSON.parse(JSON.stringify(rows)));
        if (err) {
          console.log("error: ", err);
          return res.status(200).json([]);
        } else {
          console.log("promisedata:", data[0]);

          var promises = [];
          for (var i = 0; i < data.length; i++) {

            data[i].path=data[i].path.replace('public\\',"");
            promises.push(data[i]);
            console.log("loopdata:", data[1]);
            // data[i].star = '';
          }
          Promise.all(promises).then(function (resp) {
            return res.status(200).json({
              numRows: numRows,
              numPages: numPages,
              page: page,
              limit: limit,
              posts: data
            });
          }).catch(err => {
            return res.status(200).json([]);
          });
        }
      });
    }
  });
}