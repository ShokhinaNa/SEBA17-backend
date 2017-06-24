var Config = require('../config/config.js');
var User = require('./userSchema');
var jwt = require('jwt-simple');

module.exports.login = function(req, res){

    if(!req.body.useremail){
        res.status(400).send('useremail required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }

    User.findOne({useremail: req.body.useremail}, function(err, user){
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (!user) {
            res.status(401).send('Invalid Credentials');
            return;
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if(!isMatch || err){
                res.status(401).send('Invalid Credentials');
            } else {
                res.status(200).json({token: createToken(user)});
            }
        });
    });
};

module.exports.signup = function(req, res){
    if(!req.body.useremail){
        res.status(400).send('email required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }
    if(!req.body.username){
        res.status(400).send('username required');
        return;
    }

    var user = new User();

    user.useremail = req.body.useremail;
    user.password = req.body.password;
    user.username = req.body.username;

    user.save(function(err) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(201).json({token: createToken(user)});
    });
};

module.exports.unregister = function(req, res) {
    req.user.remove().then(function (user) {
        res.sendStatus(200);
    }, function(err){
        res.status(500).send(err);
    });
};


module.exports.searchUser = function(req, res) {
    var searchText = new Buffer(req.params.query, 'base64').toString();
    var alternatives = searchText.replace(/[^\w\s@.]+/g, "#").split(/\s+/).filter(function(a) {return a !== "";});
    var filteredRegexPattern = alternatives.join("|").replace('.', '\\.');
    console.log("Search users by regex: '" + filteredRegexPattern + "'");
    var regExp = new RegExp(filteredRegexPattern, 'i');
    User.find({$or: [{username: regExp}, {useremail: regExp}]})
        .limit(10)
        .exec(function(err, users) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        if (filteredRegexPattern === "") {
            res.json({users: []});
        } else {
            res.json({
                users: users.map(function(u) {
                    return {
                        _id: u._id,
                        useremail: u.useremail,
                        username: u.username
                    }
                })
            })
        }
        });
};

module.exports.getUser = function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json({
                _id: user._id,
                useremail: user.useremail,
                username: user.username
            });
        });
};

function createToken(user) {
    var tokenPayload = {
        user: {
            _id: user._id,
            useremail: user.useremail,
            username: user.username
        }

    };
    return jwt.encode(tokenPayload,Config.auth.jwtSecret);
}