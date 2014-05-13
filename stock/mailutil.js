var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport("SMTP", {
    host: "smtp.126.com",
    //port: 25,
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    auth: {
        user: "yang_dx@126.com",
        pass: "B3ijing19"
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: "Mr Stock <yang_dx@126.com>", // sender address
    to: "yang_dx@126.com,coolinker@gmail.com", // list of receivers
    subject: "To Buy", // Subject line
    //text: "Hello world ✔", // plaintext body
    //html: "<b>Hello world ✔</b>" // html body
}

// var transport = nodemailer.createTransport(MailSend116Transport, {
//     path: "E:/works/github/node/stock/mailsend1.16"
// });

// // setup e-mail data with unicode symbols
// var mailOptions = {
//     from: "yang_dx@126.com", // sender address
//     to: "yang_dx@126.com" // list of receivers
// }


function sendEmail(subj, body) {
    mailOptions.html = body;
    mailOptions.subject = subj
    transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        transport.close(); // shut down the connection pool, no more messages
    });
}

exports.sendEmail = sendEmail;