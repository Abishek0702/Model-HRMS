const moment = require('moment')
import { apiHandler } from 'helpers/api';

// import { usersRepo } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
   
    post: add,
   
});












function add(req, res) {
  var currentTime = moment().utc().format("YYYY-MM-DD HH:mm");
  const { user_id, policy_id } = req.body;
  const acknowledge_status = req.body.acknowledge_status || 1; // Assign 1 if status is not provided

  connection.query(
    'SELECT * FROM user_policies WHERE user_id = ? AND policy_id = ?',
    [user_id, policy_id],
    function (error, results, fields) {
      if (error) {
        console.error(error.message);
        return res.status(500).json({ data: 'db error', status: 0 });
      }
 else {
        let q = "INSERT INTO `user_policies` (`id`,`user_id`, `policy_id`, `acknowledge_status`) VALUES (?,?, ?, ?)";
        let dataadd = [null,user_id, policy_id, 1, currentTime];

        connection.query(q, dataadd, (err, results, fields) => {
          if (err) {
            console.error(err.message);
            return res.status(500).json({ data: 'db error', status: 0 });
          } else {
            console.log('Reg Id: ' + results.insertId);
            return res.status(200).json({ data: 'acknowleged', status: 1 });
          }
        });
      }
    }
  );
}






