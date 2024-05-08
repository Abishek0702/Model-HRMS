
import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
const moment = require('moment');

export default apiHandler({
  post: add
});


function add(req, res) {
  var currentTime = moment().utc().format("YYYY-MM-DD HH:mm");
  const { name, created_at, updated_at } = req.body;
  const status = req.body.status || 1; // Assign 1 if status is not provided

  connection.query('SELECT * FROM leavestatus WHERE name = ?', [name], function (error, results, fields) {
    if (error) {
      // console.error(error.message);
      return res.status(500).json({ data: 'db error', status: 0 });
    }

    if (results.length > 0) {
      return res.status(200).json({ data: 'already exist', status: 0 });
    } else {
      let q = "INSERT INTO `leavestatus` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, ?)";
      let dataadd = [null, name, status, currentTime, currentTime];

      connection.query(q, dataadd, (err, results, fields) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ data: 'db error', status: 0 });
        } else {
          console.log('Reg Id: ' + results.insertId);
          return res.status(200).json({ data: 'Registered', status: 1 });
        }
      });
    }
  });
}
