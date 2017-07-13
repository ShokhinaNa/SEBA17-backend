var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.yandex.com',
    port: 465,
    secure: true,
    auth: {
        user: 'TimeetService@yandex.com',
        pass: 'meetadmin'
    }
});

module.exports.sendEmails = function(meeting) {
    var link = 'http://localhost:8000/#!/scheduling/' + meeting._id;

    var mailOptions = {
        from: 'TimeetService@yandex.com',
        to: meeting.participantEmails.toString(),
        subject: meeting.name,
        html: '<p>' + meeting.purpose + '</p>'
        + '<p>Click <a href="'+ link + '">here</a> to set your availabilities</p>'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

