var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var importJS = require('import_external_js');

var leboncoin = require('leboncoin');

var utils = importJS("utils/utils.js");

var app = express();

//paramètres pour la gestion des pages.
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

//Gestion du formulaire get général cad si on tape localhost:3000
app.get('/', function (req, res) {
    //On balance le fichier index de base.
    res.sendFile(__dirname + '/index.html');
});

//gestion du get quand on appuie sur le bouton
app.get('/reqUrl', function(req, res)
{
   var url = req.query.url;
   var newJson = Array();
   //Récupération du data sur leboncoin selon l'url
   var oldJson = leboncoin.scrapData(url, function(result)
   {
     //console.log(result);

     //parse du json récupéré
     newJson = utils.convert_leboncoinJSON_into_appJSON(url, result);
     console.log(newJson);
     //on fait un rendu de la page de resultats avec les données JSON de lbc dedans
     res.render('resultsLBC.html', {json: newJson});
   });

   //var newJson = utils.convert_leboncoinJSON_into_appJSON(url, oldJson);
   //console.log(newJson);

});

//allumage du serveur
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
