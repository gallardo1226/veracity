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

router.get('/uploadarticle', function(req, res) {
    db = req.db;
    User = db.model('User');
    User.find({}, '_id name', {sort: {'name.last':1}}, function(err, users) {
        var userMap = {};
        i = 0;
        users.forEach(function(user) {
            userMap[i++] = user;
        });

        res.render('user/upload_article', {
            title: 'Upload Article',
            "userlist": userMap,
        });
    });
});

router.post('/uploadarticle', function(req, res) {
    db = req.db;
    User = db.model('User');
    Article = db.model('Article');
    User.find({ _id: { $in:req.body.author }}, '_id', function(err, users) {
        if (err)
            return next(err);
        var idArr = [];
        i = 0;
        users.forEach(function(user) {
            idArr[i++] = user._id;
        });
        article = new Article();
        article.authors.push(idArr);
        article.section = req.body.section;
        article.title = req.body.title.trim();
        article.body = req.body.body.trim();
        article.tags = req.body.tags.split(/\s*,\s*/);
        article.save(function(err, article) {
            if (err)
                return next(err);
            res.location("uploadarticle");
            res.redirect("uploadarticle");
        });
    });
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
