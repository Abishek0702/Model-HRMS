import { apiHandler } from 'helpers/api';
const bcrypt = require('bcryptjs');
const connection = require('helpers/api/routes/pool.js');
const nodemailer = require('nodemailer');


export default apiHandler({
  put: changePassword
});

function changePassword(req, res) {
  console.log("body:",req.body);


  const { id, newPassword, currentPassword, email } = req.body;

  if ((typeof id || typeof newPassword || typeof currentPassword || typeof email) == "undefined") {
    return res.status(200).json({ status: 0, message: "fileds are empty" })
  }

  connection.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(200).json({ status: "0", message: "error" });
    } else {
      var user = result[0];
      if (user.email !== email) {
        res.status(200).json({ status: "0", message: "email not matched" });
      } else {
        const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
        if (!isPasswordValid) {
          res.status(200).json({ status: '0', message: "current password incorrect" });
        } else {
          const hashedPassword = bcrypt.hashSync(newPassword, 10);
          connection.query("UPDATE users SET password=? WHERE id=?", [hashedPassword, id], (err, result) => {
            if (err) {
              res.status(200).json({ status: '0', message: "error" });
            } else {
              console.log("updated");
              sendPasswordChangeEmail(user.email, user.name, newPassword);
              return res.status(200).json({ status: 1, message: "Password changed successfully" });
            }
          });
        }
      }
    }
  });
}


function sendPasswordChangeEmail(userEmail, name, newPassword) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'geonsstars2023@gmail.com',
      pass: 'dkjzjzciraguxboi',
    },
  });

  //   Hello Geonslogix User instead "Hello Sheik Abdullah"
  // Remove - New password: pass1234
  // Geons logix private limited - change to "HR Team"
  // <p>New password: ${newPassword}</p>

  const mailOptions = {
    from: 'geonsstars2023@gmail.com',
    to: userEmail,
    subject: 'GeonsLogix HRMS Password',
    html: `
      <p>Hello ${name},</p>
      <p>Your password has been changed successfully.</p>
      <p>If you did not perform this action, please contact our support immediately.</p>
      <p>Best regards,</p>
      <p>HR Team</p>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Failed to send email:', err);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}