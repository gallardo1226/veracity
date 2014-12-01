var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

/* GET users listing. */
router.get('/', function(req, res) {
    // if (req.session) {
    //     db = req.db;
    //     User = db.model('User');
    //     User.find({_id: req.session.user_id}, function(err, user) {
    //         if (!err) {
    //             res.location("dashboard");
    //             res.redirect("dashboard" + req.session.user_id);
    //         } 
    //     });
    // }
    res.location("login");
    res.redirect("login");
});

router.get('/login', function(req, res) {
    // if req.session {
    //     db = req.db;
    //     User = db.model('User');
    //     User.find({_id: req.session.user_id}, function(err, user) {
    //         if (!err) {
    //             res.location("dashboard");
    //             res.redirect("dashboard" + req.session.user_id);
    //         } 
    //     });
    // }
    res.render('user/login', { title: 'Veracity Staff Login'});
});

// router.post('/login', function(req, res) {
    // db = req.db;
    // User = db.model('User');
    // User.find({email: req.body.useremail}, function(err, user) {
    //     if (err)
    //         res.send('Login failed: could not find user');
    //     else{
    //         bcrypt.compare(req.body.userpassword, user.password, function(err, res) {
    //             if (err)
    //                 res.send('Login failed: incorrect password');
    //             else {
    //                 res.location("dashboard");
    //                 res.redirect("dashboard");
    //             }
    //         });
    //     }
    // });
// });

router.get('/dashboard', function(req, res) {
    // if req.session {
        // db = req.db;
        // User = db.model('User');
        // User.find({_id: req.session.user_id}, function(err, user) {
        //     if (err)
        //         res.send(500, 'Error: user not found');
        //     else
        //         res.render('user/dashboard', {'user': user});
        // });
});

module.exports = router;
