import { errorHandler, jwtMiddleware } from 'helpers/api';
const connection = require('helpers/api/routes/pool')
const crypto = require('crypto');
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');

export { sendPasswordChangeEmail, sendEmailAndUpdateDB, generateOTP, leaveapplicationMail,generatepin};


function sendPasswordChangeEmail(userEmail, newPassword) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'geonsstars2023@gmail.com',
            pass: 'dkjzjzciraguxboi',
        },
    });

    const mailOptions = {
        from: 'geonsstars2023@gmail.com',
        to: userEmail,
        subject: 'Password Changed',
        html: `
        <h1>Password Changed</h1>
        <p>Hello,</p>
        <p>Your password has been changed successfully.</p>
        <p>Email:${userEmail}</P>
        <p>New password: ${newPassword}</p>
        <p>If you did not perform this action, please contact our support immediately.</p>
        <p>Best regards,</p>
        <p>Geons logix private limited</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Failed to send email:', err);
            res.status(200).send({ status: "0", message: 'Failed to send email.' });
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send({ status: "1", message: 'mail send succesfully' });
        }
    });
}

const sendEmailAndUpdateDB = (email, randomNumber, res) => {
    const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';

    // Generate bcrypt hash of the random number
    bcrypt.hash(randomNumber.toString(), 10, (err, hash) => {
        if (err) {
            console.error('Failed to hash the password:', err);
            res.status(200).send({ status: "0", message: 'Failed to hash the password.' });
        } else {
            connection.query(updateQuery, [hash, email], (err, updateResults) => {
                if (err) {
                    console.error('Failed to update password in the database:', err);
                    res.status(200).send({ status: "0", message: 'Failed to update password in the database.' });
                } else if (updateResults.affectedRows === 0) {
                    res.status(200).send({ status: "0", message: 'User not found.' });
                } else {
                    const emailQuery = 'SELECT email FROM users WHERE email = ?';
                    connection.query(emailQuery, [email], (err, emailResults) => {
                        if (err) {
                            console.error('Failed to retrieve user email:', err);
                            res.status(200).send({ status: "0", message: 'Failed to retrieve user email.' });
                        } else if (emailResults.length === 0) {
                            res.status(200).send({ status: "0", message: 'User email not found.' });
                        } else {
                            const userEmail = emailResults[0].email;

                            // Compare email with userEmail
                            if (email !== userEmail) {
                                res.status(200).send({ status: "0", message: 'Invalid email.' });
                            } else {
                                const resetLink = `Useremail=${email} code=${randomNumber}`;

                                const updatedMailOptions = {
                                    ...mailOptions,
                                    to: userEmail,
                                    html: mailOptions.html.replace('{resetLink}', resetLink),
                                    text: `Your random number is: ${randomNumber}`,
                                };

                                transporter.sendMail(updatedMailOptions, (err, info) => {
                                    if (err) {
                                        console.error('Failed to send email:', err);
                                        res.status(200).send({ status: "0", message: 'Failed to send email.' });
                                    } else {
                                        console.log('Email sent:', info.response);
                                        res.status(200).send({ status: "1", message: "Email sent successfully." });
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    });
};

const generateRandomNumber = () => {
    const buffer = crypto.randomBytes(3); // Generate a random buffer of 3 bytes
    return parseInt(buffer.toString('hex'), 16); // Convert the buffer to a decimal number
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'geonsstars2023@gmail.com',
        pass: 'dkjzjzciraguxboi',
    },
});

const mailOptions = {
    from: 'geonsstars2023@gmail.com',
    subject: 'Password Reset',
    html: `
      <h1>Password Reset</h1>
      <p>Hello,</p>
      <p>A password reset request has been received for your account. Please follow the instructions below to reset your password:</p>
      <ol>
        <li>Please use the below code to reset your password</li>
        
        <p>Your userID and Temporary password {resetLink}</p>
      </ol>
      <p>Best regards,</p>
      <p>Geons logix private limited</p>
    `,
};









function leaveapplicationMail(user_id, name, Reason) {
    try {
        const mailOptions = {
            from: process.env.HR_EMAIL,
            to: ['gokulsabari007@gmail.com', 'trsathiya1997@gmail.com'],
            subject: "Leave Application",
            html: `
          <h1>Leave Application</h1>
          <p>Hello HR,</p>
          <p>A user has applied for leave. Here are the details:</p>
          <ul>
            <li>User ID: ${user_id}</li>
            <li>Name:${name}</li>
            <li>Reason: ${Reason}</li>
          </ul>
          <p>Please take the necessary action.</p>
          <p>Best regards,</p>
          <p>Geons logix private limited</p>
        `,
        };

        transporter.sendMail(mailOptions);

        console.log("Email sent to HR successfully");
    } catch (error) {
        console.error("Error sending email to HR:", error);
    }
}


function generateOTP() {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

const generatepin = (req, res) => {
    const digit = 'AbcDefGhijklMnoPqrsTuVwxYz0123456789';
    var PIN = '';
    for (var i = 0; i < 6; i++) {
        PIN += digit[Math.floor(Math.random() * 10)]
    }
    return PIN
 
}