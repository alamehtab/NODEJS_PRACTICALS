const nodemailer = require("nodemailer");

exports.sendEmail = async (email, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text
    });
};


// exports.sendEmail = async (email, subject, txt) => {
//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.USER_EMAIL,
//             pass: process.env.USER_PASS
//         }
//     })
//     await transporter.sendMail({
//         from: process.env.USER_EMAIL,
//         to: email,
//         subject,
//         txt
//     })
// }

