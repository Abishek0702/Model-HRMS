const moment = require('moment')
import { apiHandler } from 'helpers/api';
import status from '.';
// import { usersRepo } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({
    get: getById,
    put: update,
    delete: _delete
});





function getById(req, res) {
    const id = req.query.id;

    const getQuery = 'SELECT * FROM leavetypes WHERE id=? AND status =1';

    connection.query(getQuery, [id], (err, results) => {
        var data = Object.values(JSON.parse(JSON.stringify(results)));
       // console.log("data:", data[0]);

        if (err) {
            console.log('Error executing query:', err); s
        }
        else {
            if (typeof data[0] == "undefined") {
                return res.json({ message: "user  cannot find the properties" })
            }

            if (typeof data[0] !== "undefined") {
                return res.json(data[0])
            }
        }
    });
}








function update(req, res) {
    const updatedId = req.query.id;
    console.log("Updated Id:", updatedId);
    const updatedTime = moment().utc().format("YYYY-MM-DD HH:mm");
    console.log("Updated Time:", updatedTime);

    connection.query(
        "SELECT * FROM leavetypes WHERE id=?",
        [updatedId],
        (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ Error: err.message });
            }
            if (result.length === 0) {
                return res.status(404).json({ data: "User not found" });
            }
            const val = result[0];
           // console.log(val);

            if (val.status === 0) {
                return res.status(200).json({ data: "Users cannot modify the fields", status: 0 });
            }
            let q =
                "UPDATE leavetypes SET `TypeofLeave`=?,`Total_number_leave`=? `year`=? WHERE id=? AND status != 0";
            const { TypeofLeave, Total_number_leave, year, status } = req.body;

            const TypeofLeaveToUpdate = (status !== "0" && typeof TypeofLeave !== "undefined" && TypeofLeave !== "") ? TypeofLeave : val.TypeofLeave;
            const Total_number_leaveUpdate = Total_number_leave || Total_number_leave.status;
            const yearUpdate = year || val.year;
            const statusToUpdate = status || val.status;

            const values = [TypeofLeaveToUpdate, Total_number_leaveUpdate, yearUpdate, statusToUpdate, Total_number_leaveUpdate, updatedTime, updatedId];
            console.log(values);

            connection.query(q, values, (err, results, fields) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ data: "DB error", status: 0 });
                } else {
                    console.log("Updated Id:", updatedId);
                    return res.status(200).json({ data: "Registered", status: 1 });
                }
            });
        }
    );
}




function _delete(req, res) {
    const id = req.query.id;
    const updatedTime = moment.utc().format("YYYY-MM-DD HH:mm");
    console.log("Updated Time:", updatedTime);

    connection.query(
        "SELECT * FROM leavetypes WHERE id=?",
        [id],
        (err, result) => {
            if (typeof result[0] === "undefined") {
                return res.json({ data: "User not found" });
            }
            if (err) {
                return res.json({ Error: err.message });
            }

            const del = "UPDATE `leavetypes` SET `status`=0, `updated_at`=? WHERE `id`=?";
            const values = [updatedTime, id];

            connection.query(del, values, (error, result, fields) => {
                if (error) {
                    return res.json({ status: "failed" });
                }
                return res.json({ status: "Process successful" });
            });
        }
    );
}
