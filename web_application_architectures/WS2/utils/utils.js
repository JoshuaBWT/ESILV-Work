
//conversion #oklm #psg
function convert_leboncoinJSON_into_appJSON(url, oldJson)
{
  var newJson = {};

  newJson.url = url;
  newJson.title = oldJson.titre.replace(/_/g, " ");
  newJson.date = new Date();
  newJson.seller = {};
  newJson.seller.name = "";
  if(oldJson.offres == "pro")
  {
    newJson.seller.professionnal = true;
    newJson.seller.siren = oldJson.siren;
  }
  else
  {
    newJson.seller.professionnal = false;
    newJson.seller.siren = 0;
  }
  newJson.price = oldJson.prix;
  if(oldJson.city)
    newJson.city = oldJson.city.replace(/_/g, " ");
  else
    newJson.city = "unknown";
  newJson.postal_code = oldJson.cp;

  //A CORRIGER POUR LES MARQUES AUX NOMS COMPOSES STYLE ALPHA ROMEO OU MERCEDES CLASSE E
  newJson.brand = oldJson.marque.replace(/_/g, "+");
  newJson.model = oldJson.modele;

  newJson.year = oldJson.annee;
  newJson.mileage = oldJson.km;
  newJson.energy = oldJson.nrj;
  newJson.gearbox = oldJson.vitesse;
  newJson.options = newJson.title
   .replace(newJson.brand, "")
   .replace(newJson.model, "")
   .trim()
   .replace(/ /g, "+");
  newJson.description = oldJson.description;
  newJson.imgsrc = oldJson.imgsrc;
  newJson.brandmodeltostring = brandmodeltostring(newJson);
  newJson.updatebrandmodeltostring = function()
  {
    this.brandmodeltostring = brandmodeltostring(this);
  }

  return newJson;
}

function particularbrand(oldJson, newJson)
{
  var resu = "";
  if(oldJson.modele.toLowerCase() == "mx_5")
    resu = "mx5";
  else
    resu = oldJson.modele.replace(/_/g, "+");
  return resu;
}

function brandmodeltostring(f)
{
  return f.brand.charAt(0).toUpperCase() + f.brand.slice(1).replace(/\+/g, " ") + " " +
  f.model.charAt(0).toUpperCase() + f.model.slice(1).replace(/\+/g, " ");
}
