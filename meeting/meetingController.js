// importing Meeting model
var Meeting = require('./meetingSchema');

// Create new meeting
exports.postMeeting = function(req, res) {
    var meeting = new Meeting(req.body);
    //do not allow user to fake identity.
    if (!req.user.equals(meeting.user)) {
        res.sendStatus(401);
    }
    meeting.save(function(err, m) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(201).json(m);
    });
};

//TODO delete this before release

// Create endpoint /api/meeting for GET
exports.getMeetings = function(req, res) {
    Meeting.find(function(err, meetings) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json(meetings);
    });
};

// Create endpoint /api/meeting/:meeting_id for GET
exports.getMeeting = function(req, res) {
    // Use the Meeting model to find a specific meeting
    Meeting.findById(req.params.meeting_id, function(err, meeting) {
        if (err) {
            res.status(400).send(err)
            return;
        };

        res.json(meeting);
    });
};
// Create endpoint /api/meeting/:meeting_id for PUT
exports.putMeeting = function(req, res) {
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
exports.deleteMeeting = function(req, res) {
    // Use the Meeting model to find a specific meeting and remove it
    Meeting.findById(req.params.meeting_id, function(err, m) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        m.remove();
        res.sendStatus(200);
    });
};