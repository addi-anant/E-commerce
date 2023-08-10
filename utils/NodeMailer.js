const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Token = require("../models/Token");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "addi.anant01@gmail.com",
    pass: process.env.GMAIL_PASSWORD,
  },
});

module.exports.verifyEmail = async (email, token) => {
  const mailConfigurations = {
    from: "addi.anant01@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           http://localhost:8080/auth/verify/${token}, the url will expire in 10 minutes. 
           Thanks`,
  };

  transporter.sendMail(mailConfigurations, (Error, info) => {
    if (Error) {
      console.log(`Error while sending email: ${Error}`);
      return;
    }

    console.log("Mail sent!");
  });
};

module.exports.updatePassword = async (email, token) => {
  const mailConfigurations = {
    from: "addi.anant01@gmail.com",
    to: email,
    subject: "Password",
    text: `Hi! There, You have recently visited our website and entered your email. Please follow the given link to update/reset your password: http://localhost:8080/auth/new-password/${token}, the url will expire in 10 minutes. 
    
    Thanks`,
  };

  transporter.sendMail(mailConfigurations, (Error, info) => {
    if (Error) {
      console.log(`Error while sending email: ${Error}`);
      return;
    }

    console.log("Mail sent!");
  });
};
