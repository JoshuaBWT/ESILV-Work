var path = require('path');

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

function renderResult(req, res)
{
  res.render('results.html', {url:req.session.url,
    json:req.session.lbcJSON,
    optionsPages:req.session.optionsPages,
    data:req.session.lacentraledata,
    search:req.session.searchdata,
    err:req.session.err});
}

function renderMainPage(req, res)
{
  res.render('index.html', {err:req.session.err});
}

function renderResultsPage(req, res)
{
  var url = req.query.url;
    if(url[url.length -1] == "/")
      url = url.substr(0, url.length - 1);
  //Si on charge pour la première fois la page de réponse
  ///if(req.session == null)
  //{
    //req.session.reset();
    req.session.err = {};
    req.session.url = url;
    req.session.urlC = "";
    req.session.lbcJSON = {};
    req.session.lacentraledata = {};
    req.session.optionsPages = Array();
    req.session.budget = 0;

    if(req.query.b && req.query.b > 0)
      req.session.budget = req.query.b;

    startProcessingRequests(req, res, function()
    {
        if(req.query.optionChoices || req.query.optionChoices != "")
        {
          var selectedOption = req.query.optionChoices;
          changeRequestOptions(req, res, selectedOption, function()
          {
            renderResult(req, res);
          });
        }
        else {
          renderResult(req, res);
        }
    });
  //}
  //si on choisit de changer les options.
}

function gatherLaCentraleDataAndRender(req, res, cote, graphdata)
{
  //console.log("cote : %s vs prix : %s", cote, req.session.lbcJSON.price);

}

function startProcessingRequests(req, res, callback)
{
  leboncoin.scrapData(req.session.url, function(errLBC, result)
  {
    //parse du json récupéré
    if(!errLBC || !errLBC.haserror)
    {
      req.session.lbcJSON = result;
      lacentrale.getCotesPages(req.session.lbcJSON,  function(lacentraleresult, parameters)
      {
         if(!lacentraleresult || !parameters)
         {
          req.session.err.haserror = true;
          req.session.err.errortext = "Erreur avec le chargement des données lacentrale!";
          renderMainPage(req, res);
          return;
         }


         req.session.optionsPages = lacentraleresult.pages;
         req.session.lbcJSON = parameters;
         req.session.urlC = req.session.optionsPages[0].url;

         if(!req.session.lbcJSON.imgsrc || req.session.lbcJSON.imgsrc == "")
          req.session.lbcJSON.imgsrc = lacentraleresult.imgsrc;

         console.log("url pack selectionné : " + req.session.urlC);

         //faire la recherche preference utilisateur
         leboncoin.doResearch(req.session.url, req.session.lbcJSON, req.session.budget, function (data)
         {
           req.session.searchdata = data;
           //Obtenir l'argus et le graph pour la selection d'options
           lacentrale.getCoteAndRatings(req.session.urlC, function(cote, graphdata)
           {
              //render de la page
              req.session.lacentraledata.url = req.session.urlC;
              req.session.lacentraledata.cote = cote;
              req.session.lacentraledata.graphdata = graphdata;

              //renderResult(req, res);
              callback();
           });
         });
         //renderPage(res, url, lbcJSON, argusData, pages);
      });
    }
    else
    {
          console.log(JSON.stringify(errLBC));
          req.session.err = errLBC;
          renderMainPage(req, res);
    }
  });
}

function changeRequestOptions(req, res, selectedOption, callback)
{
  //console.log(req.session.lbcJSON);
  if(!req.session.optionsPages)
  {
    renderMainPage(req, res);
    return;
  }
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

    callback();
  });
}

module.exports = function(app)
{
  //gestion du get quand on appuie sur le bouton en ayant entré l'url (et eventuellement les options)
  app.get('/', function(req, res)
  {
    if(req.query.url == null || req.query.url == "")
        renderMainPage(req, res);
    else if(req.query.url.indexOf("http://www.leboncoin.fr/") > -1 &&
            req.query.url.indexOf("offres") <= -1)
            renderResultsPage(req, res)
    else {
        req.session.err = {};
        req.session.err.haserror = true;
        req.session.err.errortext = "recherche erronée!";
        renderMainPage(req, res);
    }
  });
}
