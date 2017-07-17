var request = require('request');
var icalendar = require('icalendar');

module.exports = function(icalFeedAddress, callback) {
    request(icalFeedAddress, function(err, response, body) {
        if (err) {
            return callback(err, null);
        }
        try {
            var ical = icalendar.parse_calendar(body);
            var slots = ical.components.VEVENT.map(function(event) {
                return {
                    range: [new Date(event.properties.DTSTART[0].value), new Date(event.properties.DTEND[0].value)],
                    priority: 0,
                    imported: true
                }
            });
            return callback(null, slots);
        } catch (e) {
            return callback(e, null);
        }
    });
};