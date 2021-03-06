var fs = require('fs');
var importJS = require('../lib/import_external_js');
var request = require('request');
var cheerio = require('cheerio');
var jquery = fs.readFileSync('./utils/jquery-1.11.3.min.js');

var utils = importJS("utils/utils.js");
var models = importJS("data/models.js");
var brands = JSON.parse(fs.readFileSync('./data/brands.json', 'utf8'));
var error = { haserror: false };

function errortesting(url, trueJson)
{
    error.haserror = false;
    if(url.indexOf("/voitures/") <= -1 || trueJson.subcat != "voitures")
    {
        //console.log("wrong category! (%s,%s)", url, trueJson.subcat);
        error.errortext = "Erreur leboncoin! Mauvaise categorie d offres! current type : "+ trueJson.subcat +"!";
        error.haserror = true;
    }
    return error;
}

function trytogetbrandandmodel(trueJson, callback)
{
  var brand, marque;
  var brands = JSON.parse(fs.readFileSync('./data/brands.json', 'utf8'));
  var split = trueJson.titre.split("_");
    for(var i = 0; i < split.length; i++)
    {
      for(var j = 0; j < brands.result.length; j++)
      {
        //console.log(brands.result[j].name);
        if(brands.result[j].id.toLowerCase().indexOf(split[i]) > -1 && split[i].length > 2)
        {
          trueJson.marque = split[i];
          //console.log(split[i]);
          break;
        }
      }
    }
  //trouver le modele de la voiture
  if(!trueJson.marque)
  {
      callback(null);
     return;
  }
  var nModels = models.getModels(trueJson.marque.toUpperCase());

  for(var i = 0; i < split.length; i++)
  {
    for(var j = 0; j < nModels.length; j++)
    {
       if((trueJson.marque == "mercedes" &&
       split[i] == "classe" &&
       i != split.length-1) ||
       (trueJson.marque == "bmw" &&
       split[i] == "serie" &&
       i != split.length-1) &&
       nModels[j].toLowerCase() == split[i] + "-" + split[i+1])
       {
         trueJson.modele = split[i] + "+" + split[i+1];
         callback(trueJson);
         return;
       }
       else if(nModels[j].toLowerCase() == split[i])
       {
         trueJson.modele = split[i].replace(/-/g, "+");
         callback(trueJson);
         return;
       }
    }
  }
  callback(null);
}

function sendResults(url, err, trueJson, finalCallback)
{
  var result = null;
  if(trueJson)
  {
    //si il manque marque/modèle.
    if(!trueJson.marque || !trueJson.modele)
      trytogetbrandandmodel(trueJson, function(json)
      {
          if(!json)
          {
            err.haserror = true;
            err.errortext = "la marque/modele de la voiture n'a pas pu être correctement déterminé";
            finalCallback(err, null);
            return;
          }
          result = utils.convert_leboncoinJSON_into_appJSON(url, json);
          finalCallback(err, result);
      });
      else {
        result = utils.convert_leboncoinJSON_into_appJSON(url, trueJson);
        //console.log(result);
        finalCallback(err, result);
      }
  }
  else
  //console.log(result);
  finalCallback(err, result);
}


function scrapData(url, finalCallback)
{
  try {
      request(url, function(reqErr, response, html){
       // First we'll check to make sure no errors occurred when making the request
       if(!reqErr)
       {
              //console.log(url);
               // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
              var $ = cheerio.load(html);
              //console.log($("h1").text());
              if($("h1").text().indexOf("introuvable") > -1)
              {
                //console.log("here");
                error.haserror = true;
                error.errortext = "Annonce désactivée!";
                finalCallback(error, null);
                return;
              }
              //Ici on récupère le script contenant les données au format txt.
              var stringedData = $("body").children()[0].children[0].data;

              //On eleve l'initialisation de la variable
              stringedData = stringedData.substr(17, stringedData.length);
              //On transforme le texte en JSON

              var trueJson = JSON.parse(JSON.stringify(eval("(" + stringedData + ")")));

              var err = errortesting(url, trueJson);
              if(err.haserror)
              {
                finalCallback(err, null);
                return;
              }

              trueJson.region = $("[class='offre selected'] > a").attr("href").replace("http://www.leboncoin.fr/annonces/offres/", "").replace(/\//g, "");
              trueJson.description = $("[itemprop=description]").text();
              if(trueJson.nbphoto != '0')
              {
                trueJson.imgsrc = $("[itemprop=image]")[0].attribs["content"];
              }
              else {
                trueJson.imgsrc = "";
              }
              //console.log(trueJson.imgsrc);
              //si la marque n'est pas spécifiée explicitement sur la page, on galère bien commme il faut
              //(donc on a récupéré une liste de toutes les marques de voiture au monde et on va fouiller un peu)
                sendResults(url, error, trueJson, finalCallback);
       }
       else {
          //console.log(reqErr);
          error.haserror = true;
          error.errortext = reqErr;
          finalCallback(error,null);
       }
     });
  }
  catch(e)
  {
    error.haserror = true;
    error.errortext = e;
    finalCallback(error,null);
  }
}

function doResearchWithUrl(offerUrl, parameters, budget, finalCallback)
{
 var query = (parameters.brand + "+" + parameters.model).replace(/_/g, "+").replace(/ /g, "+");
 if(!budget || budget == 0)
      budget = parameters.price;
 doResearch(query, budget, parameters.region, 2, function(data, error)
 {
   for(var i = 0; i < data.length; i++)
   {
      if(data[i].url == offerUrl)
        data.pop(data[i]);
   }
   finalCallback(data, error);
 });
}

//recherche des liens le bon coin
function doResearch(query, budget, region, nbr, finalCallback)
{
 try
 {
   var error = null;

   budget = Number(budget);
   var data = [];
   var prix = JSON.parse(fs.readFileSync('./data/lbcPrices.json', 'utf8'));
   var gammeSup = 0,
   gammeInf = 0;

   if(budget && budget != 0)
   for(var i = prix.options.length - 1; i >= 0; i--)
   {
      if(budget > Number(prix.options[i].value))
        if(i == prix.options.length - 1)
        {
          gammeSup = "42";
          gammeInf = "41";
          break;
        }
        else {
            gammeSup = prix.options[i+1].id;
            gammeInf = prix.options[i].id;
            break;
        }
   }

   var url = "http://www.leboncoin.fr/voitures/offres/";
   if(region && region != "")
      url += region + "/";
   else
      url+= ""
   url += "?f=a&th=1";
  if(budget && budget != 0)
  {
    url += "&ps="
    url += gammeInf;
    url += "&pe=";
    url += gammeSup;
  }
   url += "&q=";
   url += query;

   //console.log(url);

   request({url:url, method:'get'}, function(error, response, html)
   {
      var $ = cheerio.load(html);
      var index = -1;

      var divs = $("[class=list-lbc] > a");
      if(divs.length > 1)
      divs.each(function()
      {
        var curUrl = $(this).attr("href");
        ///if(curUrl == offerUrl)
        //  return(true);
        var title = $(this).attr("title");
        var img = $(this).find("[class=image-and-nb] > img").attr("src");
        var price = $(this).find("[class=price]").text().replace("€", "").replace(/ /g, "").replace(/\n/g, "");

        index++;
        data.push({});
        data[index].url = curUrl;
        data[index].title = title;
        data[index].img = img;
        data[index].price = price;

        if(index >= nbr || index >= divs.length - 2)
        {
            //console.log(data);
            finalCallback(data, error);
            return(false);
        }
      });
      else
        finalCallback(data, error);
      //finalCallback(data);
   });
   }
   catch(e)
   {
     var error = {};
     error.haserror = true;
     error.errortext = e;
     finalCallback(null, error);
   }
}

module.exports = {
  scrapData: scrapData,
  doResearchWithUrl: doResearchWithUrl,
  doResearch: doResearch
}
