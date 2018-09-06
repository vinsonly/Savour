const email = require('../emailTransporter');

module.exports = {
    sendPersonalEmail(req, res) {
        console.log(req.body);

        // setup email data with unicode symbols
        let mailOptions = {
            from: `${req.body.name} <${req.body.email}>`, // sender address
            to: 'vinsonl@sfu.ca', // list of receivers
            subject: `[Personal Site] ${req.body.subject}`, // Subject line
            text: req.body.message, // plain text body
            // html: '<b>Hello world?</b>' // html body
        };
        
        let _res = res;

        email.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                _res.status(500).send({message:'Failed.'})
            } else {
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                _res.send({message:'Message sent'});
            }
        });
    }
}