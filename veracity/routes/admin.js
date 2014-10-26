var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('admin/index', { title: 'Admin Home' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userFirst = req.body.userfirst;
    var userLast = req.body.userlast;
    var userEmail = req.body.useremail;

    var newUser = new User({
        name: {first: userFirst, last: userLast},
        email: userEmail,
        admin: false
    });
    
    newUser.save(function(err, newUser) {
        if (err)
            res.send(500, "There was a problem adding the information to the database.");    
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("manageusers");
            // And forward to success page
            res.redirect("manageusers");
        }
    });
});

router.post('/removeuser', function(req, res) {
    var user = User.remove({_id: req.param('id')}, function(err) {
        if (err) {
            console.log(err);
            res.send(500, "There was a problem removing the user from the database.");    
        }
        else {
            res.send("User successfully removed");
        }
    });
});

router.post('/updatestatus', function(req, res) {
    User.update({_id: req.param('id')}, {admin: req.param('status')}, function(err) {
        if (err) {
            console.log(err);
            res.send(500, "There was a problem updating the user in the database.");
        } else {
            res.send('Updated successfully');
        }
    });
});

router.get('/manageusers', function(req, res) {
    db = req.db;
    User = db.model('User');
    User.find({}, function(err, users) {
        var userMap = {};

        users.forEach(function(user) {
          userMap[user._id] = user;
      });
        console.log(userMap);

        res.render('admin/manage_users', { 
          title: 'Manage Users',
          "userlist" : userMap
      });
    });
});

module.exports = router;