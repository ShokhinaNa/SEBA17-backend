// Load required packages
var mongoose = require('mongoose');

var Meeting = new mongoose.Schema({
    name: String,
    purpose: String,
    location: String,
    duration: Number,
    range: [Date, Date],
    arranged_timeslot: Date,
    facilitator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    availabilities: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        slots: [{
            range: [Date, Date],
            priority: Number
        }]
    }]
});

// Export the Mongoose model
module.exports = mongoose.model('Meeting', Meeting);

