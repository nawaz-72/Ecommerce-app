const nodeMailer = require('nodemailer')

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        service: process.env.SMPT_SERVICE,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth:
        {
            email: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    })

    const mailOptioons = {
        from:process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptioons)
}

module.exports = sendEmail