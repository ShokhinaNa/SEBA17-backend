// Load required packages
var mongoose = require('mongoose');

var meetingSchema = new mongoose.Schema({
    name: String,
    purpose: String,
    location: String,
    duration: Number,
    range: [Date],
    arranged_timeslot: Date,
    facilitator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    participantEmails: [String],
    availabilities: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
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