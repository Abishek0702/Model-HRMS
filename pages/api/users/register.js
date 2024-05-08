const bcrypt = require("bcryptjs");
const moment = require("moment");

import { apiHandler } from "helpers/api";
const connection = require("helpers/api/routes/pool.js");

export default apiHandler({
  post: register,
});

function register(req, res) {

  if (req.user.designation!="admin")
  return res.status(200).json({ data: "access denined", status: 0 }); 
  
  var curtime = moment.utc().format("YYYY-MM-DD HH:mm");

  console.log("current time:", curtime);

  const { password, ...user } = req.body;
  console.log("users data :", user);
  user.hash = bcrypt.hashSync(password, 10);
  user.hash2 = bcrypt.hashSync("guest123", 10);

  if (
    typeof user.name !== "undefined" &&
    typeof user.email !== "undefined" &&
    user.name !== "" &&
    user.email !== ""
  ) {
    var apikey_name = user.name;
    var apikey_email = user.email;
    console.log("name:", apikey_name);

    connection.query(
      "SELECT * FROM users WHERE name = ? || email=?",
      [apikey_name, apikey_email],
      function (error, results, fields) {
        if (typeof results[0] !== "undefined") {
          return res.status(200).json({ data: "already exist", status: 0 });
        } else {
          if (typeof user.hash !== "undefined") {
            var password1 = user.hash;
          } else {
            var password1 = user.hash2;
          }

          if (typeof user.first_name !== "undefined") {
            var first_name = user.first_name;
          } else {
            var first_name = " ";
          }
          if (typeof user.last_name !== "undefined") {
            var last_name = user.last_name;
          } else {
            var last_name = " ";
          }
          if (typeof user.phone_number !== "undefined") {
            var phone_number = user.phone_number;
          } else {
            var phone_number = "";
          }
          if (typeof user.address !== "undefined") {
            var address = user.address;
          } else {
            var address = " ";
          }
          if (typeof user.city !== "undefined") {
            var city = user.city;
          } else {
            var city = " ";
          }
          if (typeof user.state !== "undefined") {
            var state = user.state;
          } else {
            var state = " ";
          }
          if (typeof user.country !== "undefined") {
            var country = user.country;
          } else {
            var country = " ";
          }
          if (typeof user.pincode !== "undefined") {
            var pincode = user.pincode;
          } else {
            var pincode = " ";
          }
          if (typeof user.aadhar_number !== "undefined") {
            var aadhar_number = user.aadhar_number;
          } else {
            var aadhar_number = "";
          }

          var status = 1;
          var role = "";
          var image = "";
          var employeeID = "";
          var date_of_joining = curtime;

          if (typeof user.date_of_birth !== "undefined") {
            var date_of_birth = user.date_of_birth;
          } else {
            var date_of_birth = " ";
          }
          if (typeof user.PlaceOfBirth !== "undefined") {
            var PlaceOfBirth = user.PlaceOfBirth;
          } else {
            var PlaceOfBirth = " ";
          }
          if (typeof user.gender !== "undefined") {
            var gender = user.gender;
          } else {
            var gender = " ";
          }
          if (typeof user.religion !== "undefined") {
            var religion = user.religion;
          } else {
            var religion = " ";
          }
          if (typeof user.nationality !== "undefined") {
            var nationality = user.nationality;
          } else {
            var nationality = " ";
          }
          if (typeof user.BloodGroup !== "undefined") {
            var BloodGroup = user.BloodGroup;
          } else {
            var BloodGroup = " ";
          }
          if (typeof user.disability !== "undefined") {
            var disability = user.disability;
          } else {
            var disability = "";
          }
          if (typeof user.MaritalStatus !== "undefined") {
            var MaritalStatus = user.MaritalStatus;
          } else {
            var MaritalStatus = " ";
          }
          if (typeof user.DateOfWedding !== "undefined") {
            var DateOfWedding = user.DateOfWedding;
          } else {
            var DateOfWedding = " ";
          }
          if (typeof user.SpouseName !== "undefined") {
            var SpouseName = user.SpouseName;
          } else {
            var SpouseName = " ";
          }
          if (typeof user.NumberOfChildren !== "undefined") {
            var NumberOfChildren = user.NumberOfChildren;
          } else {
            var NumberOfChildren = " ";
          }
          if (typeof user.PermanentAddress !== "undefined") {
            var PermanentAddress = user.PermanentAddress;
          } else {
            var PermanentAddress = " ";
          }
          if (typeof user.PermanentCity !== "undefined") {
            var PermanentCity = user.PermanentCity;
          } else {
            var PermanentCity = " ";
          }
          if (typeof user.PermanentState !== "undefined") {
            var PermanentState = user.PermanentState;
          } else {
            var PermanentState = " ";
          }
          if (typeof user.PermanentCountry !== "undefined") {
            var PermanentCountry = user.PermanentCountry;
          } else {
            var PermanentCountry = " ";
          }
          if (typeof user.PermanentPinCode !== "undefined") {
            var PermanentPinCode = user.PermanentPinCode;
          } else {
            var PermanentPinCode = " ";
          }
          if (typeof user.designation_id !== "undefined") {
            var designation_id = user.designation_id;
          } else {
            var designation_id = 4;
          }

          var remember_token = user.remember_token;
          var fathersname = user.fathersname;
          var mothersname = user.mothersname;

          console.log("nameee:", apikey_email);

          let a =
            "INSERT INTO `users` (`id`, `name`, `email`, `password`, `employeeID`, `first_name`, `last_name`, `phone_number`, `address`, `city`, `state`, `country`, `pincode`, `aadhar_number`, `image`, `status`, `role`, `date_of_joining`, `date_of_birth`, `PlaceOfBirth`, `gender`, `religion`, `nationality`, `BloodGroup`, `disability`, `MaritalStatus`, `DateOfWedding`, `SpouseName`, `NumberOfChildren`, `PermanentAddress`, `PermanentCity`, `PermanentState`, `PermanentCountry`, `PermanentPinCode`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`,`fathersname`,`mothersname`,`designation_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

          let val = [
            null,
            apikey_name,
            apikey_email,
            password1,
            employeeID,
            first_name,
            last_name,
            phone_number,
            address,
            city,
            state,
            country,
            pincode,
            aadhar_number,
            image,
            status,
            role,
            date_of_joining,
            date_of_birth,
            PlaceOfBirth,
            gender,
            religion,
            nationality,
            BloodGroup,
            disability,
            MaritalStatus,
            DateOfWedding,
            SpouseName,
            NumberOfChildren,
            PermanentAddress,
            PermanentCity,
            PermanentState,
            PermanentCountry,
            PermanentPinCode,
            curtime,
            remember_token,
            curtime,
            curtime,
            fathersname,
            mothersname,
            designation_id,
          ];

          connection.query(a, val, async (err, result, fields) => {
            const data = Object.values(JSON.parse(JSON.stringify(result)));

            user.star = "success Thankyou";
            console.log("data:", data[0]);
            if (err) {
              console.log(err.message);
              return res.status(200).json({ data: "db error", status: 0 });
            } else {
              const designationdata = new Promise((resolve, reject) => {
                connection.query(
                  "SELECT users.id,users.name,users.designation_id,designations.designationName FROM `users` LEFT JOIN `designations` designations ON users.designation_id=designations.id WHERE users.id=?",
                  [result.insertId],
                  (err, result) => {
                    if (err) {
                      resolve([]);
                    } else {
                      resolve(result);
                    }
                  }
                );
              });
              console.log();

              try {
                const [data1] = await Promise.all([designationdata]);

                console.log("desc_error:", data1[0].designationName);
                if (typeof data1[0] !== "undefined") {
                  var prefix = data1[0].designationName;
                  var post = prefix.substring(0, 2);
                  console.log("abcd", post);
                } else {
                  var post = "AA";
                }
                if (result.insertId <= 9) {
                  var k = "00" + result.insertId;
                } else if (result.insertId <= 99) {
                  var k = "0" + result.insertId;
                } else {
                  var k = result.insertId;
                }

                var empId = `GL1` + `${k}`;
                var u = "UPDATE users SET employeeID=? WHERE id=?";
                connection.query(u, [empId, result.insertId], (err, result) => {
                  if (err) {
                    return res.json(err.message);
                  } else {
                    res.json({ status: "successsss" });
                  }
                });
              } catch (error) {
                res.status(500).json({ error: "Internal Server Error" });
              }
            }
          });
        }
      }
    );
  } else {
    return res
      .status(200)
      .json({ data: "invalid data / username or email empty", status: 0 });
  }
}
