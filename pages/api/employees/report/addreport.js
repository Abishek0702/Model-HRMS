import { apiHandler } from 'helpers/api'
import moment from 'moment'
const connection = require('helpers/api/routes/pool.js')

const requestIp = require('request-ip');





export default apiHandler({
    post: addreport,
})

function addreport(req, res) {
    //console.log("te:",req.user);
    if (req.user.login_id) {
        var login_id = req.user.login_id
        var today = moment().utcOffset("+5:30").format("YYYY-MM-DD HH:mm")
        var todayDate = moment.utc().format("YYYY-MM-DD")
        var todayDate1 = moment.utc().format("MM-DD")
        var startTime = moment().utcOffset("+05:30").format("HH:mm a")
        var date = moment.utc().format("YYYY-MM-DD")

        console.log("Today:", today)
        console.log("Todaydate:", todayDate)
        console.log("startTime :", startTime);
        console.log("startDate :", date);

        const clientIp = requestIp.getClientIp(req);
        // console.log('Client IP:', clientIp);
        var ip = clientIp.split(',')[0];
        var end_ip = ip.split(':').slice(-1)
        console.log("Ip :", end_ip);


        //check 
        var today = moment().utcOffset("+5:30").format("YYYY-MM-DD HH:mm")
        var q = `SELECT * FROM reports WHERE DATE_FORMAT(startTime,'%m-%d')= ? AND user_id = ?`

        connection.query(q, [todayDate1, login_id], async (err, result) => {
            if (err) throw err;
            console.log("result :", result);

            var data = Object.values(JSON.parse(JSON.stringify(result)))

            console.log("data:", data);
            if (typeof result[0] == "undefined") {


                const { ...user } = req.body;

                var description = user.description || '';
              //  var end_ip = user.end_ip || '';

               


                var q = "INSERT INTO `reports`(`id`, `user_id`, `startTime`, `description`, `start_ip`,`end_ip`, `created`, `modified`) VALUES (?,?,?,?,?,?,?,?)"

                const val = [null, login_id, today, description, end_ip, end_ip, today, today]
                connection.query(q, val, async (err, result) => {
                    if (err) throw err;
                    console.log("inserted_id :", result.insertId);
                    return res.json({ status: 2, id: result.insertId, Time: startTime, Date: date, designation: req.designation, login_id: login_id })
                })



            } else if (data[0].endTime == null) {
                //const q = "UPDATE `reports` SET `endTime`=?,`end_ip`=? WHERE `user_id`=?";
                //const val = [today, today, login_id];

                const q = "UPDATE `reports` SET `endTime`=?,`end_ip`=? WHERE `id`=?";
                const val = [today, end_ip, data[0].id];

                



                console.log("val", val);

                connection.query(q, val, (err, result) => {
                    if (err) throw err;

                    return res.json({ status: 3, Message: "Logout successful" });
                });
            } else {
                res.json({ message: "You are logout please wait for next day" })
            }

        })

    } else {
        res.json({ message: "You are logout please wait for next day" })
    }

}


