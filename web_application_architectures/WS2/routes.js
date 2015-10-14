var path = require('path');
var importJS = require('import_external_js');
var utils = importJS("utils/utils.js");

var leboncoin = require('leboncoin');
var lacentrale = require('lacentrale');

/*
var edmunds = require('node-edmunds');

var vehicle_api_key = 'baxaqtjkr9h7z2tmzu3eeufq';
var client = edmunds.createVehicleClient(vehicle_api_key);
client.getListOfModelsByMake('Ford', function (result) {
  console.log(result);
});
*/

module.exports = function(app)
{
  function renderResult(req, res)
  {
    res.render('resultsLBC.html', {url:req.session.url,
      json:req.session.lbcJSON,
      optionsPages:req.session.optionsPages,
      data:req.session.lacentraledata});
  }

  function renderMainPage(req, res)
  {
    res.render('index.html', {err:req.session.err});
  }

  function renderResultsPage(req, res)
  {
    var url = req.query.url;
    //Test si le JSON existe déjà et si on a selectionné un page.
    //console.log(req.session);
    if(req.query.f)
    {
      //req.session.reset();
      req.session.url = url;
      req.session.urlC = "";
      req.session.lbcJSON = {};
      req.session.lacentraledata = {};
      req.session.optionsPages = Array();


      leboncoin.scrapData(url, function(result, errLBC)
      {
        //parse du json récupéré
        if(!errLBC.haserror)
        {
          req.session.lbcJSON = utils.convert_leboncoinJSON_into_appJSON(req.session.url, result);
          lacentrale.getCotesPages(req.session.lbcJSON, function(lacentraleresult)
          {
             req.session.optionsPages = lacentraleresult;
             req.session.urlC = req.session.optionsPages[0].url;

             console.log("url : " + req.session.urlC);

             lacentrale.getCoteAndRatings(req.session.urlC, function(cote, graphdata)
             {
                req.session.lacentraledata.url = req.session.urlC;
                req.session.lacentraledata.cote = cote;
                req.session.lacentraledata.graphdata = graphdata;

                renderResult(req, res);
             });
             //renderPage(res, url, lbcJSON, argusData, pages);
          });
        }
        else {
              req.session.err = errLBC;
              renderMainPage(req, res);
        }
      });
    }
    else {
      var selectedOption = req.query.optionChoices;
      req.session.optionsPages.forEach(function(element, index, array)
      {
        //console.log("Options : %s, (%s,%s)", selectedOption, element.name, element.url);
        if(element.name == selectedOption)
        {
            req.session.urlC = element.url;
        }
      });

      console.log("selected choice : %s", req.session.urlC);

      lacentrale.getCoteAndRatings(req.session.urlC, function(cote, graphdata)
      {
         req.session.lacentraledata.url = req.session.urlC;
         req.session.lacentraledata.cote = cote;
         req.session.lacentraledata.graphdata = graphdata;

         renderResult(req, res);
      });
    }

    //var newJson = utils.convert_leboncoinJSON_into_appJSON(url, oldJson);
    //console.log(newJson);
  }

  //gestion du get quand on appuie sur le bouton en ayant entré l'url (et eventuellement les options)
  app.get('/', function(req, res)
  {
     if(req.query.url == null)
        renderMainPage(req, res);
    else
        renderResultsPage(req, res)
  });
}
