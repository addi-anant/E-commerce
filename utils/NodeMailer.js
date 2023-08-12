const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "addi.anant01@gmail.com",
    pass: process.env.GMAIL_PASSWORD,
  },
});

module.exports.verifyEmail = async (email, token, host) => {
  const mailConfigurations = {
    from: "addi.anant01@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Hi! There, You have recently visited our website and entered your email. Please follow the given link to verify your email http://${host}/auth/verify/${token}, the url will expire in 10 minutes. Thanks`,
  };

  transporter.sendMail(mailConfigurations, (Error) => {
    if (Error) {
      console.log(`Error while sending email: ${Error}`);
      return;
    }
  });
};

module.exports.updatePassword = async (email, token, host) => {
  const mailConfigurations = {
    from: "addi.anant01@gmail.com",
    to: email,
    subject: "Password",
    text: `Hi! There, You have recently visited our website and entered your email. Please follow the given link to update/reset your password: http://${host}/auth/new-password/${token}, the url will expire in 10 minutes. Thanks`,
  };

  transporter.sendMail(mailConfigurations, (Error, info) => {
    if (Error) {
      console.log(`Error while sending email: ${Error}`);
      return;
    }
  });
};

module.exports.successful = async (email) => {
  const mailConfigurations = {
    from: "addi.anant01@gmail.com",
    to: email,
    subject: "Password",
    text: `Hi! Your password has been changed successfully!. Thanks`,
  };

  transporter.sendMail(mailConfigurations, (Error, info) => {
    if (Error) {
      console.log(`Error while sending email: ${Error}`);
      return;
    }
  });
};
