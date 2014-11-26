var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

/* GET users listing. */
router.get('/', function(req, res) {
    res.location("login");
    res.redirect("login");
});

router.get('/login', function(req, res) {
    req.session.lastPage = '/login';
	res.render('user/login', { title: 'Veracity Staff Login'});
});

router.post('/login', function(req, res) {
    // Set our internal DB variable
    db = req.db;
    User = db.model('User');
    User.find({email: req.body.useremail}, function(err, user) {
    	bcrypt.compare(req.body.userpassword, user.password, function(err, res) {
    		
		});
    });
});

module.exports = router;
