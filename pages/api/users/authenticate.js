const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
import getConfig from "next/config";
//import NextCors from 'nextjs-cors';

import { apiHandler } from "helpers/api";
const connection = require("helpers/api/routes/pool.js");

const { serverRuntimeConfig } = getConfig();

export default apiHandler({
  post: authenticate,
});

async function authenticate(req, res) {
  const { username, password } = req.body;
  var newpassword = bcrypt.hashSync(password, 10);
  // var newpassword= bcrypt.compareSync(password, user.hash);
  console.log("pass:", newpassword);

  // validate
  connection.query(
    "SELECT  `users`.*,d.designationName FROM users LEFT JOIN designations d ON d.id = users.designation_id WHERE users.status=1  AND users.email = ?   group by users.id",
  // "SELECT `users`.*,d.designationName FROM `users` LEFT JOIN designations d ON d.id = users.designation_id  where users.email = ? AND users.status=1  group by users.id"
    [username],
    async function (error, results, fields) {
      if (typeof results[0] === "undefined") {
        return res.status(200).json({ status: 0, Message: "user not found" });
      } else {
        const validPassword = await bcrypt.compare(
          password,
          results[0].password
        );
        if (validPassword) {
          const data = Object.values(JSON.parse(JSON.stringify(results)));
          var user = data[0];
          console.log("login:", user.id);

          if(user.department_id!=2){
            var designation="employee";
            }else{
              var designation="admin"
            }

          // create a jwt token that is valid for 7 days
          const token = jwt.sign({ login_id: user.id,designation:designation }, serverRuntimeConfig.secret, {
            expiresIn: "10h",
          });

          //expiresIn: "10h" // it will be expired after 10 hours //expiresIn: "20d" // it will be expired after 20 days //expiresIn: 120 // it will be expired after 120ms //expiresIn: "120s" // it will be expired after 120s
          

          // return basic user details and token
          return res.status(200).json({
            status: 1,
            id: user.id,
            username: user.name,
            designation_id: user.designation_id,
            department_id: user.department_id,
            designation:designation,
            designationName:user.designationName,
            email:user.email,
            token,
          });

           
        } else {
          return res
            .status(200)
            .json({ status: 0, password: "invalid password" });
        }
      }
    }
  );
}
