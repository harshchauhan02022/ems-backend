const nodemailer = require("nodemailer");

const sendEmail = async (email, resetLink, subject) => {
 try {
  const transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
   service: 'gmail',
   port: 587,
   secure: false,
   auth: {
    user: 'harshchauhan02022@gmail.com',
    pass: 'isag hejn uvyy umoi',
   },
  });

  const response = await transporter.sendMail({
   from: "ems@gmail.com",
   to: email,
   subject: subject,
   text: resetLink
  });
  return "email sent sucessfully"
 }
 catch (error) {
  console.log("Error while sending email", error);
 }

}
module.exports = sendEmail