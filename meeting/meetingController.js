var User = require('../user/userSchema');
var Meeting = require('./meetingSchema');
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



// Create new meeting
exports.postMeeting = function (req, res) {
    var meeting = new Meeting(req.body);
    //do not allow user to fake identity.
    if (!req.user.equals(meeting.facilitator)) {
        res.sendStatus(401);
    }
    console.log("Adding new meeting: " + JSON.stringify(meeting));
    meeting.save(function (err, m) {
        if (err) {
            res.status(400).send(err);
            return;
        }
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


        res.status(201).json(m);
    });
};

// Create endpoint /api/meeting for GET
exports.getMeetings = function (req, res) {
    Meeting.find(function (err, meetings) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json(meetings);
    });
};

// Create endpoint /api/meeting/:meeting_id for GET
exports.getMeeting = function (req, res) {
    // Use the Meeting model to find a specific meeting
    Meeting.findById(req.params.meeting_id, function (err, meeting) {
        if (err) {
            res.status(400).send(err);
            return;
        }

        res.json(meeting);
    });
};

// Create endpoint /api/meeting/findByFacilitator/:facilitator_id for GET
exports.findMeetingsByFacilitatorId = function (req, res) {
    // Use the Meeting model to find a specific meeting
    User.findById(req.params.facilitator_id, function (err, user) {
        if (err) {
            res.status(400).send(err);
            return;
        }

        Meeting.find({facilitator: user}, function (err, meetings) {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.json(meetings);
        });
    });

};

// Create endpoint /api/meeting/:meeting_id for PUT
exports.putMeeting = function (req, res) {
    // Use the Meeting model to find a specific meeting and update it
    Meeting.findByIdAndUpdate(
        req.params.meeting_id,
        req.body,
        {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        }, function (err, meeting) {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.json(meeting);
        });
};

// Create endpoint /api/meeting/:meeting_id for DELETE
exports.deleteMeeting = function (req, res) {
    // Use the Meeting model to find a specific meeting and remove it
    Meeting.findById(req.params.meeting_id, function (err, m) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        m.remove();
        res.sendStatus(200);
    });
};

// Create endpoint /api/meeting/:meeting_id/timeslots for PUT
exports.setMeetingAvailabilities = function (req, res) {

    var meeting = new Meeting(req.body);
    console.log("Updating availabilities for meeting: " + JSON.stringify(meeting));

    // Use the Meeting model to find a specific meeting and update it
    Meeting.findByIdAndUpdate(
        meeting._id,
        meeting,
        {
            new: true,
            //run validations
            runValidators: true
        }, function (err, meeting) {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.json(meeting);
        });
};