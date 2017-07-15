// Load required packages
var mongoose = require('mongoose');

var meetingSchema = new mongoose.Schema({
    name: String,
    purpose: String,
    location: String,
    duration: Number,
    range: [Date],
    dayRange: [Number],
    arranged_timeslot: Date,
    facilitator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    participantEmails: [String],
    availabilities: [{
        // TODO: make this a proper reference again when we create real backend users for anonymous users
        user: String,
        slots: [{
            range: [Date],
            priority: Number
        }]
    }],
    bestSlots:[{
        range: [Date]
    }]
});

// Export the Mongoose model
var Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;