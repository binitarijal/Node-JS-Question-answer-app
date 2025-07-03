const nodemailer = require('nodemailer');
const sendEmail =async(data) => {
    const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: "rijalbinita01@gmail.com", // Your email address
                pass: "hqkvsdchbvenjnqk" // Your email password
            }


    })

    const mailOptions={
        from: "hehekcha@gmail.com",
        to:data.email,
        subject: data.subject,
        text: data.text,

    }
   await transporter.sendMail(mailOptions)
}
module.exports = sendEmail; // Export the sendEmail function for use in other modules
// Note: Make sure to replace the email and password with your actual credentials or use environment variables