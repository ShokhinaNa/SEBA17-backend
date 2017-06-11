var Meeting = require('../meeting/meetingSchema');
var User = require('../user/userSchema');

var Config = require('../config/config.js');

var mongoose = require('mongoose');
mongoose.connect([Config.db.host, '/', Config.db.name].join(''),{
    //eventually it's a good idea to make this secure
    user: Config.db.user,
    pass: Config.db.pass
});

var user1 = new User({
    username: "user1",
    password: "pass1",
    useremail: "email1"
});

user1.save(function(err, created_user) {
    if (err) {
        throw err;
    }
    console.log(created_user);

    var meeting = new Meeting({
        name: "Test Meeting",
        purpose: "Test if meeting schema works",
        location: "StuSta",
        duration: 30,
        range: [new Date(2017, 6, 3), new Date(2017, 6, 11)],
        arranged_timeslot: null,
        facilitator: created_user._id,
        participants: [created_user._id],
        availabilities: [{
            user: created_user._id,
            slots: [{
                range: [new Date(2017, 6, 5), new Date(2017, 6, 8)],
                priority: 1
            }]
        }]
    });

    meeting.save(function(err, created_meeting) {
        if (err) {
            throw err;
        }
        console.log(created_meeting);
        User.remove({ username: 'user1' }, function(err) {
            if (err) {throw err}

        });
    });
});
