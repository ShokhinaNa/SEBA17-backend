module.exports = meetingRoutes;


function meetingRoutes(passport) {

    var meetingController = require('./meetingController');
    var router = require('express').Router();
    var unless = require('express-unless');

    var mw = passport.authenticate('jwt', {session: false});
    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS', 'PUT']}));

    router.route('/')
        .post(meetingController.postMeeting)
        .get(meetingController.getMeetings);

    router.route('/:meeting_id/timeslots')
        .put(meetingController.setMeetingAvailabilities);

    router.route('/:meeting_id/arrangedtimeslot')
        .put(meetingController.setArrangedTimeslot);

    router.route('/:meeting_id/importCalendar/:user_id')
        .put(meetingController.importCalendar);

    router.route('/:meeting_id')
        .get(meetingController.getMeeting)
        .put(meetingController.putMeeting)
        .delete(meetingController.deleteMeeting);

    router.route('/findByFacilitator/:facilitator_id')
        .get(meetingController.findMeetingsByFacilitatorId);

    return router;
}
