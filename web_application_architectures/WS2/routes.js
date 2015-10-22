var path = require('path');

var leboncoin = require('./lib/leboncoin');
var lacentrale = require('./lib/lacentrale');

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

function renderSearchPage(req, res)
{
    res.render("search.html", {data:req.session.searchData,
    err:req.session.err});
}

function renderCellResult(req, res)
{
  var fullUrl = req.protocol + '://' + req.get('host') + "/?url=";
  req.session.url = fullUrl + req.session.url;
  req.session.lbcJSON.title = req.session.lbcJSON.title.toUpperCase();
  res.render('cell.html', {url:req.session.url,
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

function renderResultsPage(req, res, callback)
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

    startProcessingRequests(req, res, function(req)
    {
        if(req.session.err.haserror)
        {
            callback(req, res);
            return;
        }
        if(req.query.optionChoices && req.query.optionChoices != "")
        {
          var selectedOption = req.query.optionChoices;
          req.session.urlC = changeRequestOptions(req, res, selectedOption);
        }
        callback(req, res);
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
          callback(req, res);
          return;
         }

         req.session.optionsPages = lacentraleresult.pages;
         req.session.lbcJSON = parameters;
         req.session.urlC = req.session.optionsPages[0].url;

         if(!req.session.lbcJSON.imgsrc || req.session.lbcJSON.imgsrc == "")
          req.session.lbcJSON.imgsrc = lacentraleresult.imgsrc;

         //console.log("url pack selectionné : " + req.session.urlC);

         //faire la recherche preference utilisateur
         leboncoin.doResearchWithUrl(req.session.url, req.session.lbcJSON, req.session.budget, function (data, error)
         {
           if(error)
           {
             console.log("Problème recherche");
             req.session.err = errLBC;
             callback(req, res);
             return;
           }

           req.session.searchdata = data;
           //Obtenir l'argus et le graph pour la selection d'options
           lacentrale.getCoteAndRatings(req.session.urlC, req.session.lbcJSON, function(cote, graphdata, coteAffine)
           {
              req.session.lacentraledata.url = req.session.urlC;
              req.session.lacentraledata.cote = cote;
              req.session.lacentraledata.graphdata = graphdata;
              req.session.lacentraledata.coteAffine = coteAffine;

              callback(req, res);
           });
              //render de la page
         });
         //renderPage(res, url, lbcJSON, argusData, pages);
      });
    }
    else
    {
          console.log(JSON.stringify(errLBC));
          req.session.err = errLBC;
          callback(req, res);
    }
  });
}

function changeRequestOptions(req, res, selectedOption)
{
  //console.log(req.session.lbcJSON);
  var result = "";
  if(!req.session.optionsPages)
  {
    renderMainPage(req, res);
    return null;
  }
  req.session.optionsPages.forEach(function(element, index, array)
  {
      //console.log("Options : %s, (%s,%s)", selectedOption, element.name, element.url);
      if(element.name == selectedOption)
      {
          //console.log("selected choice : %s", element.name, element.url);
          result = element.url;
          return(false);
      }
  });
  return result;
}

module.exports = function(app)
{
  //gestion du get quand on appuie sur le bouton en ayant entré l'url (et eventuellement les options)
  app.get('/', function(req, res)
  {
    var b = null;
    if(req.query.b != null && req.query.b != "")
      b = Number(req.query.b);
    if(req.query.url == null || req.query.url == "")
        renderMainPage(req, res);
    else if(req.query.url.indexOf("http://www.leboncoin.fr/") > -1 &&
            req.query.url.indexOf("offres") <= -1)
            renderResultsPage(req, res, function(req, res)
            {
                if(req.haserror)
                  renderMainPage(req, res)
                else
                  renderResult(req, res);
            });
    else if(req.query.url.indexOf("http://www") <= -1)
    {
        leboncoin.doResearch(req.query.url, b, "ile_de_france", 8, function(data, error)
        {
           if(error && error.haserror || data.length <= 0)
           {
              if(error && error.haserror)
                req.session.err = error;
              else {
                req.session.err = {};
                req.session.err.haserror = true;
                req.session.err.errortext = "recherche vide!";
              }
              renderMainPage(req, res);
              return;
           }

           req.session.searchData = data;
           //console.log(data);

            renderSearchPage(req, res);
        });
    }
    else{
        req.session.err = {};
        req.session.err.haserror = true;
        req.session.err.errortext = "recherche erronée!";
        renderMainPage(req, res);
    }
  });

  app.get('/cell', function(req, res)
  {
    if(req.query.url == null || req.query.url == "")
        renderMainPage(req, res);
    else if(req.query.url.indexOf("http://www.leboncoin.fr/") > -1 &&
            req.query.url.indexOf("offres") <= -1)
            renderResultsPage(req, res, function(req, res)
            {
                //console.log(req.session);
                //console.log("succes ajax call!");
                if(!req.session.err.haserror)
                  renderCellResult(req, res);
                else {
                  res.end();
                }
            });
    else {
        req.session.err = {};
        req.session.err.haserror = true;
        //req.session.err.errortext = "recherche erronée!";
        //renderMainPage(req, res);
    }
  });
}
