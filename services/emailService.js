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
    meeting.participantEmails.forEach(function(participantEmail) {
        // For non-logged in users generate a unique id and add it to the link
        var uuid = uuidv4();
        var link = 'http://localhost:8000/#!/scheduling/' + meeting._id + '/' + uuidv4();

        var mailOptions = {
            from: 'TimeetService@yandex.com',
            to: participantEmail,
            subject: meeting.name,
            html: '<p>' + meeting.purpose + '</p>'
            + '<p>Click <a href="' + link + '">here</a> to set your availabilities</p>'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
};

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}