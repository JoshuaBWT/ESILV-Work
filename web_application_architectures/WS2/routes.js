var path = require('path');
var importJS = require('import_external_js');
var utils = importJS("utils/utils.js");

var leboncoin = require('leboncoin');
var lacentrale = require('lacentrale');

module.exports = function(app)
{
  function renderResult(req, res)
  {
    res.render('resultsLBC.html', {url:req.session.url,
      json:req.session.lbcJSON,
      optionsPages:req.session.optionsPages,
      data:req.session.lacentraledata});
  }

  function renderMainPage(res)
  {
    res.render(__dirname + '/index.html');
  }

  function renderResultsPage(req, res)
  {
    var url = req.query.url;
    //Test si le JSON existe déjà et si on a selectionné un page.
    //console.log(req.session);
    if(req.query.firstQuery)
    {
      //req.session.reset();
      req.session.url = url;
      req.session.urlC = "";
      req.session.lbcJSON = {};
      req.session.lacentraledata = {};
      req.session.optionsPages = Array();


      var oldJson = leboncoin.scrapData(url, function(result)
      {
        //parse du json récupéré
        req.session.lbcJSON = utils.convert_leboncoinJSON_into_appJSON(req.session.url, result);
        lacentrale.getCotesPages(req.session.lbcJSON, function(lacentraleresult)
        {
           req.session.optionsPages = lacentraleresult;
           req.session.urlC = req.session.optionsPages[0].url;

           var lacentraledata = {};


           lacentrale.getCoteAndRatings(req.session.urlC, function(cote, graphdata)
           {
              req.session.lacentraledata.url = req.session.urlC;
              req.session.lacentraledata.cote = cote;
              req.session.lacentraledata.graphdata = graphdata;

              renderResult(req, res);
           });
           //renderPage(res, url, lbcJSON, argusData, pages);
        });
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
        renderMainPage(res);
    else
        renderResultsPage(req, res)
  });
}
