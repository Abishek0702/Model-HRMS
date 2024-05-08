const bcrypt = require("bcryptjs");
const moment = require("moment");
import { apiHandler } from "helpers/api";

const connection = require("helpers/api/routes/pool.js");

export default apiHandler({
  get: userdata

});



function userdata(req,res){
  if(typeof req.query.user_id!=='undefined'){
      var id=req.query.user_id;  
        connection.query("SELECT `id`, `user_id`, `leavetype_id` ,`leavestatus_id`, `approveruser_id`, `numberOfDays`, `approverReason`, `created_at`, `updated_at` FROM `leavemanagements`;",[id], function (error, results, fields) {
                const data = Object.values(JSON.parse(JSON.stringify(results)));
                 //console.log('results-',data);  
                if(error){	 
                    return res.status(200).json([]);
                }else{
                    return res.status(200).json(data[0]);
                }
         });
  }else{
      return res.status(200).json([]);
  }
  }

