var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('admin/index', { title: 'Admin Home' });
});

router.get('/adduser', function(req, res) {
    res.render('admin/add_user', { title: 'Add New User' });
});

router.get('/manageusers', function(req, res) {
	var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
    	res.render('admin/manage_users', { 
    		title: 'Manage Users',
            "userlist" : docs
        });
    });
});

module.exports = router;