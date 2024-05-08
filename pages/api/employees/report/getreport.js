import { apiHandler } from 'helpers/api'
import moment from 'moment'
const connection = require('helpers/api/routes/pool.js')


export default apiHandler({
    get: getreport,
})

function getreport(req, res) {


    if (req.user.login_id) {
        var login_id=req.user.login_id

    var today = moment.utc().format("YYYY-MM-DD HH:mm ")
    var todayDate = moment.utc().format("YYYY-MM-DD ")
    var todayDate1 = moment.utc().format("MM-DD ")
    var startTime = moment().utcOffset("+05:30").format("HH:mm a")
    var date = moment.utc().format("YYYY-MM-DD")

    console.log("Today:", today)
    console.log("Todaydate:", todayDate)
    console.log("Todaydate:", todayDate1)
    console.log("startTime :", startTime);
    console.log("startDate :", date);

    var get = "select * from reports WHERE DATE_FORMAT(startTime,'%m-%d')= ? AND user_id= ?"

    connection.query(get, [todayDate1, login_id], (err, result) => {
        if (err) throw err;
        console.log(result);
        if (typeof result[0] == "undefined") {
            return res.status(200).json({rstatus :1, message: "You are not Login" })
        }else{
            if (result[0].startTime !== "" && result[0].endTime !== null) {
                return res.status(200).json({rstatus:3,  message: "please wait for next day" })
            }else  if (result[0].startTime !== "" && result[0].endTime == null) {
                return res.status(200).json({ rstatus :2,message: "You are Login" })
            }else  {
                return res.status(200).json({ rstatus:3, message: "You are Logout" })
            }   

        }
        
    })

}else{
         
    return res.sendStatus(401);
}

}