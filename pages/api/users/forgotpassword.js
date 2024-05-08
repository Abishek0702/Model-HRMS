import { apiHandler} from "helpers/api";
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

import {generateOTP, generatepin } from "services/apiservices/mail.services";

const connection = require('helpers/api/routes/pool.js')

export default apiHandler({
    post: forgetpassword,
    put: resetpassword
})


function forgetpassword(req, res) {

    const { ...user } = req.body

    if (typeof user.email !== "undefined" && user.email !== "") {

        var email = user.email;
        connection.query("SELECT email FROM users WHERE email=?", [email], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "db error" })
            } else {
                if (typeof result[0] == "undefined") {
                    return res.status(500).json({ status:1,message: "email id not found" })
                } else {
                   
                    var ency = bcrypt.hashSync(email, 10)

                    var generatedOTP = generateOTP();

                    
                    const transpoter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'geonsstars2023@gmail.com',
                            pass: 'yggwtbsrylbqvaey',
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    })

                    const mailOptions = {
                        from: 'geonsstars2023@gmail.com',
                        to: result[0].email,
                        subject: 'New Password',
                        html: `
                          <p>Hello User,</p>
                          <p>Your OTP is : <strong>${generatedOTP}</strong></p>

                          <p>Please use this OTP for Reset Your Password.</p>
                          <p>If you did not request a new password, please contact our support immediately.</p>
                          <p>Best regards,</p>
                          <p>Geons logix private limited</p>
                        `,
                    };

                    transpoter.sendMail(mailOptions, (err, info) => {

                     
                        if (err) throw err;

                        connection.query("UPDATE users SET `pin`=? WHERE email=?", [generatedOTP, result[0].email], (err, result) => {
                            if (err) throw err;
                            return res.status(200).json({ status: 2, token: ency, message: "OTP sended Successfully" })
                        })
                        
                    })
                }
            }
        })

    } else {
        return res.status(500).json({ data: "email id empty" })
    }
}



function resetpassword(req, res) {




    const { ...user } = req.body;
    var email = user.email
    var otp = user.otp

    if (typeof otp !== "undefined" && otp !== "") {

        connection.query("SELECT * FROM users WHERE email=?", [email], (err, result) => {
            if(err){
                return res.status(500).json({status:1,message:"DB error"})
            }
          else if (typeof result[0] == "undefined") {
                return res.status(500).json({status:1,message: "email id not found" })
            } 
            else {
                //check
                var pin = result[0].pin;
              
                if (pin == otp) {

                    var generatedPIN = generatepin();

                   
                    var newpass = bcrypt.hashSync(generatedPIN, 10)

                    const transpoter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'geonsstars2023@gmail.com',
                            pass: 'yggwtbsrylbqvaey',
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    })
                    const mailOptions = {
                        from: 'geonsstars2023@gmail.com',
                        to: email,
                        subject: 'New Password',
                        html: `
                              <p>Hello User,</p>
                              <p>Your Password is : <strong>${generatedPIN}</strong></p>
                  
                              <p> Please change this password as soon as possible</p>
                              <p>If you did not request a new password, please contact our support immediately.</p>
                              <p>Best regards,</p>
                              <p>Geons logix private limited</p>
                            `,
                    };

                    transpoter.sendMail(mailOptions, (err, info) => {


                        if (err) throw err;

                        connection.query("UPDATE users SET `password`=?,pin=null WHERE email=?", [newpass, email], (err, result) => {
                            if (err) throw err;
                            return res.status(200).json({ status: 3, message: "Password has been successfully sent to your email" })
                        })
                       
                    })


                   
                } else {
                    return res.status(500).json({status:2,message: "OTP Invalid" })
                }
            }
        })


    } else {
        return res.status(500).json({status:2, message: "invalid / otp empty" })

    }


}