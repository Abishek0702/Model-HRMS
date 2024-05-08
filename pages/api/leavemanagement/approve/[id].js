const moment = require('moment')
import { apiHandler } from 'helpers/api';

const connection = require('helpers/api/routes/pool.js');

export default apiHandler({

    put: update,

   
});



function update(req, res) {

  if (req.user.designation!="admin")
  return res.status(200).json({ data: "access denined", status: 0 }); 
  
    const updatedId = req.query.id;
    console.log("Updated Id:", updatedId);
    var updatedTime = moment.utc().format("YYYY-MM-DD HH:mm");
    console.log("Updated Time:", updatedTime);
  
    connection.query(
      "SELECT * FROM leavemanagements WHERE id=?",
      [updatedId],
      (err, result) => {
        if (err) {
          return res.json({ Error: err.message });
        } else {
          var val = result[0];

          //console.log(val);
  
          let q = "UPDATE leavemanagements SET id=?, leavestatus_id=?, approveruser_id=?, approverReason=? WHERE id=?";
  
          const { id,leavestatus_id, approveruser_id, approverReason } = req.body;
  
          const values = [
            id  || val.id,
            leavestatus_id || val.leavestatus_id,
            approveruser_id || val.approveruser_id ||'1',
            approverReason || val.approverReason || '-',
            // approverReason !== undefined ? approverReason : (val.approverReason || '-'),
            updatedId
          ];
         
          connection.query(q, values, function (err, results, fields) {
            if (err) {
              console.error(err.message);
              return res.status(200).json({ data: "DB error", status: 0 });
            } else {
              console.log("Updated Id:", updatedId);
              return res.status(200).json({ data: "Updated", status: 1 });
            }
          });
        }
      }
    );
  }