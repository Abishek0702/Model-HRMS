const moment = require('moment')
import { apiHandler } from 'helpers/api';

const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
  put: update,
});


function update(req, res) {

  if (req.user.designation !== "admin") { return res.status(200).json({ message: "User Access Denied", status: 0 }) }

  const updatedId = req.query.id;
  console.log("Updated Id:", updatedId);
  var updatedTime = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
  console.log("Updated Time:", updatedTime);

  connection.query(
    "SELECT * FROM helpdesk WHERE id=?",
    [updatedId],
    (err, result) => {
      if (err) {
        res.json({ Error: err.message });
      } else {
        var val = result[0];
        const { helpstatus, approver_id, approved_description, } = req.body;

        let q = "UPDATE helpdesk SET  helpstatus_id=?, approver_id=?, approved_description=?, modified = ? WHERE id=?";

        const values = [
          // id  || val.id,
          helpstatus || val.helpstatus,
          approver_id || val.approver_id || '1',
          approved_description || val.approved_description || '-',
          updatedTime,
          updatedId
        ];

        connection.query(q, values, function (err, results, fields) {
          if (err) {
            console.error(err.message);
            res.status(200).json({ message: "DB error", status: 0 });
          } else {
            console.log("Updated Id:", updatedId);
            return res.status(200).json({ message: "Updated", status: 1 });
          }
        });
      }
    }
  );
}