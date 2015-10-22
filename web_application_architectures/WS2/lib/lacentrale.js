var fs = require('fs');
var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var importJS = require('../lib/import_external_js');

var utils = importJS("utils/utils.js");

//Une fois sur la page contenant l'argus et le graph argus, on les récupère ici
var getCoteAndRatings = function getCoteAndRatings(urlC, json, callback)
{
  request({ url:urlC, method:'GET' },
  function(err, response, body)
  {
    if(err) {
      console.log(err); return;
    }
    var $ = cheerio.load(body);
    var graphdata = "http://lacentrale.fr/" + $("#histo").attr("src");
    var cote = $(".tx12 > span").text();
    cote = parseInt(cote.replace(/ /g, "").replace("€", ""));

    getCoteAffinee($, json, function(coteAffine)
    {
      //json.coteAffine = coteAffine;
      callback(cote, graphdata, coteAffine);
    });
    //console.log("cote : " + cote);
  });
}

//si la voiture a la mauvaise annee/pas d'annee sur le bon coin
function resolveUrlIfProblem(url, body, parameters, callback)
{
  try
  {
  //On tombe sur une page du style http://www.lacentrale.fr/cote-voitures-jeep----.html
    var $ = cheerio.load(body);

    var options = Array();
    var url2 = "";

    //Si on tombe direct sur la deuxième page
    var jqry = parameters.brand.replace(/\+/g, "\\+") + "-" + parameters.model.replace(/\+/g, "\\+").replace(/_/g, "\\+");
    if($('[href*=' + "cote-voitures-" + jqry + ']').length === 0)
    {
      if(parameters.model != "autres")
      options.push(parameters.model);
      parameters.title.split(' ').forEach(function(element, index, array)
      {
        if(element != parameters.brand)
          options.push(element);
      });
      for(var i = 0; i < options.length; i++)
      {
        //options[i].replace(/\+/g, "");
        var jqry = parameters.brand.replace(/\+/g, "\\+") + "-" + options[i].replace(/\+/g, "\\+").replace(/_/g, "\\+");
        if($('[href*=' + jqry + '--]').length !== 0)
        {
          url2 = "http://www.lacentrale.fr/" + $('[href*=' + jqry + '--]').attr("href");
          parameters.model = options[i];
          parameters.options.replace(parameters.model.toString(), "");
          parameters.updatebrandmodeltostring();
        }
      }
    }
    else {
      url2 = url;
    }

    console.log("validated url : " + url2);
    //Après recherche du model de la voiture dans les modèles disponibles on tombe sur une page du style
    //http://www.lacentrale.fr/cote-voitures-jeep-renegade---suv_4x4.html
    //plus qu'a trouver l'année
    if(url2 == null || url2 == "")
    {
        var error = {};
        error.haseror = true;
        error.errortext = "Impossible de trouver la marque du model";
        callback(null,null,null,error);
        return;
    }

    request({ url:url2, method:'GET' },
    function(err, response, body)
    {
        var urls = Array();
        if(err)
        {
          console.log(err);
          return;
        }
        $ = cheerio.load(body);
        var jqry = "cote-voitures-" + parameters.brand.replace(/\+/g, "\\+") + "-" + parameters.model.replace(/\+/g, "\\+").replace(/_/g, "\\+");
        //jqry.replace(/\+/g, "\\\+")
        $('[href*=' + jqry + ']').each(function ()
        {
          var curUrl = "http://www.lacentrale.fr/" + $(this).attr("href");
          var index = curUrl.indexOf(parameters.model.replace(/_/g, "+")) + parameters.model.length + 1;
          curUrl = curUrl.substr(0, index) +
          parameters.options +
          curUrl.substr(index);
          curUrl.replace("r//", "/");
          urls.push(curUrl);
          //console.log($(this).attr("href"));
        });

        var vUrl = urls[0];
        if(parameters.year && parameters.year != 0)
        {
          //console.log(new Date().getFullYear(), parameters.year);
          if(Number(parameters.year) == Number(new Date().getFullYear()))
          {
            vUrl = urls[0];
          }
          else
          {
            for(var i = 0; i < urls.length; i++)
            {
                //console.log(urls[i]);
                if(urls[i].indexOf(parameters.year + "-.html") > -1)
                {
                  vUrl = urls[i];
                }
            }
            if(vUrl == urls[0])
              vUrl = urls[urls.length - 1];
          }
        }

        request({ url:vUrl, method:'GET' },
        function(err, response, body)
        {
          //On renvoie la page de resultats avec les options
          callback(body, parameters, vUrl, null);
        });
    });
  }
  catch(err)
  {
    console.log(err);
    var error = {};
    error.haserror = true;
    error.errortext = err;
    callback(null, null, null, error);
  }
}

//Obtenirla liste des options disponibles pour le véhicule
function getOptionsList($, callback)
{
  var result = {};
  result.pages = Array();
  result.imgsrc = $('#main').attr("src");
  //console.log("src : " + result.imgsrc);
  $('#TabAnnHomeCote').children('tr')
  .each(function(index){
    if(index != 0)
    {
      var urlC = "http://lacentrale.fr/" + $(this).children()[1].children[1].attribs["href"];
      var name = $(this).children()[1].children[1].children[0].data;

      if(urlC && name && urlC != "" && name != "")
        result.pages.push({ "url": urlC, "name": name });
      //console.log("pack %s : %s, %s", index, name, urlC);
    }
  });

  callback(result);
}

function getCoteAffinee($, json, callback)
{
    var div = $('script:contains("PersoQuot")').text();
    var fields = div.match(/PersoQuot((.*));/)[0]
      .replace("PersoQuot(", "")
      .replace(");", "")
      .replace(/ /g, "")
      .replace(/\'/g, "")
      .split(',');
    var baseCote = fields[0];
    var idtd = fields[1];
    var millesime = fields[2];
    var energy = fields[3];
    var power = fields[4];
    var firsthand = 2;
    var type = fields[5];

    var url = "http://www.lacentrale.fr/ze_proxy.php?ws=get_cote_lc&user=js&password=none&out=js&type=perso&dtid=";
    url += idtd;
    url += "&millesime=";
    url += millesime;
    url += "&km=";
    url += json.mileage;
    url += "&firsthand=";
    url += 2;
    url += "&fdt=";
    url += millesime + "-01";
    url += "&categorie=";
    url += type;
    url += "&cote=";
    url += baseCote;
    url += "&energy=";
    url += energy;
    url += "&power=";
    url += power;

    //console.log(url);
    request(url, function(err, response, body)
    {
        var data = body;
        var result = body
            .replace("var T_out = new Array();T_out['appr_km']=", "")
            .replace("T_out['appr_pm']=", "")
            .replace("T_out['appr_mec']=", "")
            .replace(/\'/g, "")
            .replace(/ /g, "")
            .split(";");
        var cote = Number(baseCote);
        //console.log(result);
        for(var i = 0; i < result.length - 1; i++)
        {
            result[i] = Number(result[i]);
            cote = cote + result[i];
        }
        console.log("cote affinee : " + cote);
        callback(cote);
    });
}

//Obtenir la liste des pages disponibles pour le véhicule selon les options.
var getCotesPages =  function(parameters, callback)
{
     try
     {
       var url = "http://www.lacentrale.fr/cote-voitures";
       url += "-" + parameters.brand;
       if(parameters.model != "autres")
        url += "-" + parameters.model;
       url += "-" + parameters.options;
       url += "-" + parameters.year + "-.html";

      console.log("maked url : " + url);

      request({ url:url, method:'GET' },
      function(err, response, body) {
        console.log("resolved url : " + response.request.uri.href);
        if(err) {
          console.log(err); return;
        }
          var result = {};
          var $ = cheerio.load(body);
          
          //si on arrive directement sur la page contenant la cote
          if(response.request.uri.href == "http://www.lacentrale.fr/lacote_origine.php" ||
          response.request.uri.href == "http://www.lacentrale.fr/" ||
          $("html").html().indexOf("Error 42") > -1)
          {
            callback(null, null);
          }
          else if($('.tx12 > span').length !== 0)
          {
            var result = {};
            result.pages = Array();
            result.pages.push({ "url": response.request.uri.href, "name": "true Story" });
            callback(result, parameters);
          }
          //cette balise existe sur la page de résultats uniquement
          else if($('#TabAnnHomeCote').length === 0)
          {
            resolveUrlIfProblem(url, body, parameters, function(nbody, nparameters, validatedUrl, error)
            {
                if(!nbody || !nparameters || !validatedUrl || (error && error.haserror))
                {
                  callback(null,null);
                }

                $ = cheerio.load(nbody);

                //Si la fonction getYearIfWrong retourne directement la page de résultat contenant la cote.
                if(response.request.uri.href == "http://www.lacentrale.fr/lacote_origine.php/" ||
                        response.request.uri.href == "http://www.lacentrale.fr/")
                {
                  callback(null, null);
                }
                else if($('.tx12 > span').length !== 0)
                {
                  var result = {};
                  result.pages = Array();
                  result.pages.push({ "url": validatedUrl, "name": "" });
                  callback(result, nparameters);
                }
                else
                {
                  parameters = nparameters;
                  //console.log(body);
                  getOptionsList($, function(resultF)
                  {
                      result = resultF;
                      callback(result, parameters);
                  });
                }
            })
          }
          //si on est redirigés vers la page d'accueil
          //si tout marche comme sur des roulettes
          else
            getOptionsList($, function(resultF)
            {
              result = resultF;
              callback(result, parameters);
            });
          //console.log(body);
      });
     }
     catch(err)
     {
       //console.log(err);
       callback(null, null);
     }
};
module.exports = {
  getCotesPages: getCotesPages,
  getCoteAndRatings: getCoteAndRatings
}
