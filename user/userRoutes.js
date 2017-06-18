module.exports = userRoutes;

function userRoutes(passport) {

    var userController = require('./userController');
    var router = require('express').Router();

    router.post('/login', userController.login);
    router.post('/signup', userController.signup);
    router.post('/unregister', passport.authenticate('jwt', {session: false}),userController.unregister);
    router.get('/:user_id', userController.getUser);
    router.get('/search/:query', userController.searchUser); //NOTE: :query here is base64 string

    return router;

}