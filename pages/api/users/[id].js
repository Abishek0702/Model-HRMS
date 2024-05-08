const bcrypt = require("bcryptjs");
const moment = require("moment");
import { apiHandler } from "helpers/api";
const connection = require("helpers/api/routes/pool.js");

export default apiHandler({
  get: getById,
  put: update,
  delete: _delete,
});

// get user details
function getById(req, res) {
  connection.query("SELECT * FROM `users` WHERE status=1 AND id=?", [req.query.id], (err, result) => {
    if (err) { return res.json({ data: "db error" }); }
    else if (result.length === 0) { return res.json({ data: "user not found" }); }
    else { return res.json(result[0]); }
  });
}

// Update user details
function update(req, res) {
  // if (req.user.designation != "admin") {return res.status(200).json({ data: "access denined", status: 0 });}
  const updatedId = req.query.id;
  var updatedTime = moment.utc().format("YYYY-MM-DD HH:mm");

  connection.query("SELECT * FROM users WHERE status=1 AND id=?", [updatedId], (err, result) => {
    if (err) { return res.json({ Error: err.message }); }
    else {
      var val = JSON.parse(JSON.stringify(result));
      let q = "UPDATE `users` SET `name`=?,`email`=?, `personalemail`=?, `employeeID`=?,`first_name`=?,`last_name`=?,`phone_number`=?, `emergency_contact`=? , `address`=?,`city`=?,`state`=?,`country`=?,`pincode`=?,`aadhar_number`=?,`image`=?,`status`=?,`role`=?, `designation_id`=?, `department_id`=?, `date_of_joining`=?, `date_of_birth`=?, `PlaceOfBirth`=?, `gender`=?, `religion`=?, `nationality`=?, `BloodGroup`=?, `disability`=?, `MaritalStatus`=?, `DateOfWedding`=?, `SpouseName`=?, `NumberOfChildren`=?, `PermanentAddress`=?, `PermanentCity`=?, `PermanentState`=?, `PermanentCountry`=?, `PermanentPinCode`=?, `email_verified_at`=?, `remember_token`=?, `created_at`=?, `updated_at`=?, `fathersname`=?, `mothersname`=?, `doc`=?, `lastLogin`=?, `acknowledge`=?, `remarks`=? WHERE `id`=?";
      const { ...user } = req.body;

      if (typeof user.name !== "undefined" && user.name !== "") { var name = user.name; } else { var name = val[0].name; }
      if (typeof user.email !== "undefined" && user.email !== "") { var email = user.email; } else { var email = val[0].email; }
      if (typeof user.personalemail !== "undefined" && user.personalemail !== "") { var personalemail = user.personalemail; } else { var personalemail = val[0].personalemail; }
      if (typeof user.password !== "undefined" && user.password !== "" && user.password) { user.hash = bcrypt.hashSync(user.password, 10); var password = user.hash; } else { var password = val[0].password; }
      if (typeof user.employeeID !== "undefined" && user.employeeID !== "") { var employeeID = user.employeeID; } else { var employeeID = val[0].employeeID; }
      if (typeof user.first_name !== "undefined" && user.first_name !== "") { var first_name = user.first_name; } else { var first_name = val[0].first_name; }
      if (typeof user.last_name !== "undefined" && user.last_name !== "") { var last_name = user.last_name; } else { var last_name = val[0].last_name; }
      if (typeof user.phone_number !== "undefined" && user.phone_number !== "") { var phone_number = user.phone_number; } else { var phone_number = val[0].phone_number; }
      if (typeof user.emergency_contact !== "undefined" && user.emergency_contact !== "") { var emergency_contact = user.emergency_contact; } else { var emergency_contact = val[0].emergency_contact; }
      if (typeof user.address !== "undefined" && user.address !== "") { var address = user.address; } else { var address = val[0].address; }
      if (typeof user.city !== "undefined" && user.city !== "") { var city = user.city; } else { var city = val[0].city; }
      if (typeof user.state !== "undefined" && user.state !== "") { var state = user.state; } else { var state = val[0].state; }
      if (typeof user.country !== "undefined" && user.country !== "") { var country = user.country; } else { var country = val[0].country; }
      if (typeof user.pincode !== "undefined" && user.pincode !== "") { var pincode = user.pincode; } else { var pincode = val[0].pincode; }
      if (typeof user.aadhar_number !== "undefined" && user.aadhar_number !== "") { var aadhar_number = user.aadhar_number; } else { var aadhar_number = val[0].aadhar_number; }
      if (typeof user.image !== "undefined" && user.image !== "") { var image = user.image; } else { var image = val[0].image; }
      if (typeof user.status !== "undefined" && user.status !== "") { var status = user.status; } else { var status = val[0].status; }
      if (typeof user.role !== "undefined" && user.role !== "") { var role = user.role; } else { var role = val[0].role; }
      if (typeof user.designation_id !== "undefined" && user.designation_id !== "") { var designation_id = user.designation_id; } else { var designation_id = val[0].designation_id; }
      if (typeof user.department_id !== "undefined" && user.department_id !== "") { var department_id = user.department_id; } else { var department_id = val[0].department_id; }
      if (typeof user.date_of_joining !== "undefined" && user.date_of_joining !== "") { var date_of_joining = user.date_of_joining; } else { var date_of_joining = val[0].date_of_joining; }
      if (typeof user.date_of_birth !== "undefined" && user.date_of_birth !== "") { var date_of_birth = user.date_of_birth; } else { var date_of_birth = val[0].date_of_birth; }
      if (typeof user.PlaceOfBirth !== "undefined" && user.PlaceOfBirth !== "") { var PlaceOfBirth = user.PlaceOfBirth; } else { var PlaceOfBirth = val[0].PlaceOfBirth; }
      if (typeof user.gender !== "undefined" && user.gender !== "") { var gender = user.gender; } else { var gender = val[0].gender; }
      if (typeof user.religion !== "undefined" && user.religion !== "") { var religion = user.religion; } else { var religion = val[0].religion; }
      if (typeof user.nationality !== "undefined" && user.nationality !== "") { var nationality = user.nationality; } else { var nationality = val[0].nationality; }
      if (typeof user.BloodGroup !== "undefined" && user.BloodGroup !== "") { var BloodGroup = user.BloodGroup; } else { var BloodGroup = val[0].BloodGroup; }
      if (typeof user.disability !== "undefined" && user.disability !== "") { var disability = user.disability; } else { var disability = val[0].disability; }
      if (typeof user.MaritalStatus !== "undefined" && user.MaritalStatus !== "") { var MaritalStatus = user.MaritalStatus; } else { var MaritalStatus = val[0].MaritalStatus; }
      if (typeof user.DateOfWedding !== "undefined" && user.DateOfWedding !== "") { var DateOfWedding = user.DateOfWedding; } else { var DateOfWedding = val[0].DateOfWedding; }
      if (typeof user.SpouseName !== "undefined" && user.SpouseName !== "") { var SpouseName = user.SpouseName; } else { var SpouseName = val[0].SpouseName; }
      if (typeof user.NumberOfChildren !== "undefined" && user.NumberOfChildren !== "") { var NumberOfChildren = user.NumberOfChildren; } else { var NumberOfChildren = val[0].NumberOfChildren; }
      if (typeof user.PermanentAddress !== "undefined" && user.PermanentAddress !== "") { var PermanentAddress = user.PermanentAddress; } else { var PermanentAddress = val[0].PermanentAddress; }
      if (typeof user.PermanentCity !== "undefined" && user.PermanentCity !== "") { var PermanentCity = user.PermanentCity; } else { var PermanentCity = val[0].PermanentCity; }
      if (typeof user.PermanentState !== "undefined" && user.PermanentState !== "") { var PermanentState = user.PermanentState; } else { var PermanentState = val[0].PermanentState; }
      if (typeof user.PermanentCountry !== "undefined" && user.PermanentCountry !== "") { var PermanentCountry = user.PermanentCountry; } else { var PermanentCountry = val[0].PermanentCountry; }
      if (typeof user.PermanentPinCode !== "undefined" && user.PermanentPinCode !== "") { var PermanentPinCode = user.PermanentPinCode; } else { var PermanentPinCode = val[0].PermanentPinCode; }
      if (typeof user.email_verified_at !== "undefined" && user.email_verified_at !== "") { var email_verified_at = user.email_verified_at; } else { var email_verified_at = val[0].email_verified_at; }
      if (typeof user.remember_token !== "undefined" && user.remember_token !== "") { var remember_token = user.remember_token; } else { var remember_token = val[0].remember_token; }
      if (typeof user.created_at !== "undefined" && user.created_at !== "") { var created_at = val[0].created_at; } else { var created_at = val[0].created_at; }
      if (typeof user.updated_at !== "undefined" && user.updated_at !== "") { var updated_at = updatedTime; } else { var updated_at = updatedTime; }
      if (typeof user.fathersname !== "undefined" && user.fathersname !== "") { var fathersname = user.fathersname; } else { var fathersname = val[0].fathersname; }
      if (typeof user.mothersname !== "undefined" && user.mothersname !== "") { var mothersname = user.mothersname; } else { var mothersname = val[0].mothersname; }
      if (typeof user.doc !== "undefined" && user.doc !== "") { var doc = user.doc; } else { var doc = val[0].doc; }
      if (typeof user.lastLogin !== "undefined" && user.lastLogin !== "") { var lastLogin = user.lastLogin; } else { var lastLogin = val[0].lastLogin; }
      if (typeof user.acknowledge !== "undefined" && user.acknowledge !== "") { var acknowledge = user.acknowledge; } else { var acknowledge = val[0].acknowledge; }
      if (typeof user.remarks !== "undefined" && user.remarks !== "") { var remarks = user.remarks; } else { var remarks = val[0].remarks; }

      const values = [name, email, personalemail, employeeID, first_name, last_name, phone_number, emergency_contact, address, city, state, country, pincode, aadhar_number, image, status, role, designation_id, department_id, date_of_joining, date_of_birth, PlaceOfBirth, gender, religion, nationality, BloodGroup, disability, MaritalStatus, DateOfWedding, SpouseName, NumberOfChildren, PermanentAddress, PermanentCity, PermanentState, PermanentCountry, PermanentPinCode, email_verified_at, remember_token, created_at, updated_at, fathersname, mothersname, doc, lastLogin, acknowledge, remarks, updatedId];
      connection.query(q, values, function (err, results, fields) {
        if (err) { console.error(err.message); return res.status(200).json({ data: "db error", status: 0 }); }
        else { console.log("updated Id:", updatedId); return res.status(200).json({ data: "Updated", status: 1 }); }
      });
    }
  }
  );
}

// delete user details
function _delete(req, res) {
  const DeletedId = req.query.id;
  connection.query("SELECT * FROM users WHERE id=?", [DeletedId], (err, result) => {
    console.log("result length : ", result.length);
    if (err) { return res.json({ Error: err.message }); }
    else if (result.length === 0) { return res.json({ data: "user not found" }); }
    else {
      let q = "UPDATE `users` SET `status`='0' WHERE `id`=?";
      const values = [DeletedId];
      connection.query(q, values, function (err, results, fields) {
        if (err) { console.error(err.message); return res.status(200).json({ data: "db error", status: 0 }); }
        else { console.log("Deleted Id:", DeletedId); return res.status(200).json({ data: "Deleted", status: 1 }); }
      });
    }
  });
}


