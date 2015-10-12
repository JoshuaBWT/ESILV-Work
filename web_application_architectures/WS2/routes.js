var path = require('path');
var bodyParser = require('body-parser');
var importJS = require('import_external_js');
var utils = importJS("utils/utils.js");

var leboncoin = require('leboncoin');
var lacentrale = require('lacentrale');

module.exports = function(app)
{
  //Gestion du formulaire get général cad si on tape localhost:3000
  app.get('/', function (req, res) {
      //On balance le fichier index de base.
      res.sendFile(__dirname + '/index.html');
  });

  //gestion du get quand on appuie sur le bouton en ayant entré l'url (et eventuellement les options)
  app.post('/reqUrl', function(req, res)
  {
     var url = req.body.url;
     //var url = req.query.url;

     //Test si le JSON existe déjà et si on a selectionné un page.

     var lbcJSON = {};
     var argusData = {};
     var pages = Array();

     findlbcJSON(url, lbcJSON, argusData, pages);

     //var newJson = utils.convert_leboncoinJSON_into_appJSON(url, oldJson);
     //console.log(newJson);
  });

  function findlbcJSON(url, lbcJSON, argusData, pages)
  {
    //Récupération du data sur leboncoin selon l'url
    var oldJson = leboncoin.scrapData(url, function(result)
    {
      //console.log(result);

      //parse du json récupéré
      lbcJSON = utils.convert_leboncoinJSON_into_appJSON(url, result);
      lacentrale.getRatings(lbcJSON, function(lacentraleresult)
      {
         pages = lacentraleresult;
         //res.render('resultsLBC.html', {url:url, json:lbcJSON, pages:pages});
         renderPage();
      });
    });
  }

  function renderPage(url, lbcJSON, argusData, pages)
  {
    res.render('resultsLBC.html', {url:url, json:lbcJSON, pages:pages}));
  }

  app.get('/options', function(req, res)
  {
    console.log("in ze form");
  });

}
