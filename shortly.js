var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var session = require('express-session');

var db = require('./app/config');
var Users = require('./app/collections/users');
var User = require('./app/models/user');
var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
// app.use(session({
//   secret: 'simeon',
//   resave: false,
//   saveUnitialized: true,
//   cookie: {secure: true}
// }));

// function restrict(req, res, next) {
//   if (req.session.user) {
//     next();
//   } else {
//     req.session.error = 'Access denied!';
//     res.redirect('/login');
//   }
// }


app.get('/', 
function(req, res) {
  if (req.session.user) {
    res.render('index');
  } else {
    res.redirect('/login');
  }
});
    

app.get('/login', function(req, res) {
  //test that user is signed in
  res.render('login');
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.post('/signup', function(req, res) {
  new User({ username: req.body.username, password: req.body.password }).fetch().then(function(found) {
    if (found) {
      res.status(200).send(found.attributes);
    }
    Users.create({
      username: req.body.username,
      password: req.body.password,
    })
    .then(function(newUser) {
      res.set('location', '/');
      res.status(200).send(newUser);
    });
  });
  // console.log('We\'ve created the user in the database!');
  // User.where('username', 'apple').fetch().then(function(user) {
  //   console.log('We found ' + user);
  //   console.log(user);
  // }).catch(function(err) {
  //   console.log(err);
  // });
});


app.get('/create', 
function(req, res) {
  if (req.session.user) {
    res.render('index');
  } else {
    res.redirect('/login');
  }
});

app.get('/links', 
function(req, res) {
  if (req.session.user) {
    Links.reset().fetch().then(function(links) {
      res.status(200).send(links.models);
    });
  } else {
    res.redirect('/login');
  }
});

app.post('/links',
function(req, res) {
  if (req.session.user) {
    var uri = req.body.url;

    if (!util.isValidUrl(uri)) {
      console.log('Not a valid url: ', uri);
      return res.sendStatus(404);
    }

    new Link({ url: uri }).fetch().then(function(found) {
      if (found) {
        res.status(200).send(found.attributes);
      } else {
        util.getUrlTitle(uri, function(err, title) {
          if (err) {
            console.log('Error reading URL heading: ', err);
            return res.sendStatus(404);
          }

          Links.create({
            url: uri,
            title: title,
            baseUrl: req.headers.origin
          })
          .then(function(newLink) {
            res.status(200).send(newLink);
          });
        });
      }
    });
  } else {
    res.redirect('/login');
  }
});

/************************************************************/
// Write your authentication routes here
/************************************************************/



/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        linkId: link.get('id')
      });

      click.save().then(function() {
        link.set('visits', link.get('visits') + 1);
        link.save().then(function() {
          return res.redirect(link.get('url'));
        });
      });
    }
  });
});

console.log('Shortly is listening on 4568');
app.listen(4568);
