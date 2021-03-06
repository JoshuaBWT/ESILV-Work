var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var path = require('path');

var app = express();

//paramètres pour la gestion des pages.
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use("/utils", express.static(__dirname + '/utils'));
app.use("/views", express.static(__dirname + '/views'));
app.use("/style", express.static(__dirname + '/style'));
app.use("/images", express.static(__dirname + '/images'));
app.use(cookieParser());
app.use(session({
  secret: 'TheKeyOfTheDestinyOfSteevenLyDABOOM1234',
  resave: true,
  saveUninitialized: true})
);

//gestion des formulaires dans le module routes
require("./routes")(app);

//allumage du serveur
var server = app.listen(3000, function () {
  var port = server.address().port;

  console.log('LeBonArgus app listening at http://localhost:%s', port);
});
