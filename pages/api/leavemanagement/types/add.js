
import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
const moment = require('moment');

export default apiHandler({
  post: add
});


function add(req, res) {
  var currentTime = moment().utc().format("YYYY-MM-DD HH:mm");
  const { id, TypeofLeave, Total_number_leave, year, created_at, updated_at } = req.body;
  const status = req.body.status || 1;

  connection.query('SELECT * FROM leavetypes WHERE id = ?', [id], function (error, results, fields) {
    if (error) {
      console.error(error.message);
      return res.status(500).json({ data: 'db error', status: 0, error: error.message });
    }

    if (results.length > 0) {
      return res.status(200).json({ data: 'already exist', status: 0 });
    } else {
      let q = "INSERT INTO `leavetypes` (`id`, `TypeofLeave `, `Total_number_leave`, `status`, `Year`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, ?, ?, ?)";
      let dataadd = [null, TypeofLeave, Total_number_leave, status, year, currentTime, currentTime];

      connection.query(q, dataadd, (err, results, fields) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ data: 'db error', status: 0, error: err.message });
        } else {
          console.log('Reg Id: ' + results.insertId);
          return res.status(200).json({ data: 'Registered', status: 1 });
        }
      });
    }
  });
}
