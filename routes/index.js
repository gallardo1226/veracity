var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('public/index', { title: 'Home' });
});

router.get('/about', function(req, res) {
	res.render('public/about', { title: 'About Us' });
});

router.get('/contact', function(req, res) {
	res.render('public/contact', { title: 'Contact Us' });
});

router.get('/campus', function(req, res) {
//     var db = req.db;
//     Article = db.model('Article');
//     articlelist = Article.find({section: 'Campus'}).skip(1);
//     featured = Article.findOne({section: 'Campus'});
//     sidebar = Article.findOne({section: 'Gray Area'});
// 	res.render('public/section', { 
//         section_title: 'Campus',
//         sub_section_title: 'Gray Area',
//         'articlelist': articlelist,
//         'featured': featured,
//         'sidebar': sidebar
//     });
	res.render('public/campus', { title: 'Campus' });
});

router.get('/journey', function(req, res) {
    var db = req.db;
    Article = db.model('Article');
    // User = db.model('User');
    articlelist = Article.find({ section: 'Journey', archive_time: null }, '_id title subtitle authors', { sort: { create_time: 1 }});
    console.log(articlelist[0]);
    // featured = articlelist.shift();
    // sidebar = Article.findOne({ section: 'Bloom', archive_time: null }, '_id title subtitle authors', { sort: { create_time: 1 }});
    res.end();
    // res.render('public/section', {
    //     title: 'Journey',
    //     'articlelist': articlelist,
        // 'featured': featured,
      // 'sidebar': sidebar
    // });
});
// 	res.render('public/journey', { title: 'Journey' });
// });

router.get('/lifeandculture', function(req, res) {
	
//     var db = req.db;
//     Article = db.model('Article');
//     articlelist = Article.find({section: 'Life &amp; Culture'}).skip(1);
//     featured = Article.findOne({section: 'Life &amp; Culture'});
//     sidebar = Article.findOne({section: 'Vera in the City'});
//     res.render('public/section', { 
//         section_title: 'Life &amp; Culture',
//         sub_section_title: 'Vera in the City',
//         'articlelist': articlelist,
//         'featured': featured,
//         'sidebar': sidebar
//     });
	res.render('public/life_and_culture', { title: 'Life &amp; Culture' });
});

router.get('/article', function(req, res) {
//     var db = req.db;
//     Article = db.model('Article');
//     Article.find({_id: req.param('id')}, function(err, article) {
//         if (err)
//             res.send(500, 'Article could not be found');
//         else {
//             res.render('public/article', {
//                 'article': article
//             });
//         }
//     });
	res.render('public/article', { title: 'Test Article' });
});

router.get('/image/:id', function(req, res) {
  db = req.db;
  Article = db.model('Article');
  Article.findById(req.param('id'), 'img', function(err, article) {
    if (err) return next(err);
    if (user.img.contentType) {
      res.send(user.img.data);
    } else
      res.send(fs.readFileSync('./public/images/logo.png'));
  });
});

module.exports = router;
