const moment = require('moment');
import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
    post: add   
    });


// Create Query

function add(req, res) {
    const { user_id, type_id,employee_description, } = req.body;
    const createdTime = moment().utcOffset("+5:30").format("YYYY-MM-DD HH:mm:ss")

    const insertQuery =
        'INSERT INTO `helpdesk` (`id`,`user_id`,`type_id`,`employee_description`,`helpstatus_id`,`approver_id`,`approved_description`, `status`, `created`, `modified`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const values = [null,user_id,type_id,employee_description,1, '-','-', 1, createdTime, createdTime];

    connection.query(insertQuery, values, (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'DB error', details: err.message });
        } else {
            // console.log('New Designation Id:', results.insertId);
            return res.status(200).json({
                messege: 'data added Successfully',
                status: 1
            });
        }
    });
}
