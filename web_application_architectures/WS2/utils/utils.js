
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
  newJson.city = oldJson.city.replace(/_/g, " ");
  newJson.postal_code = oldJson.cp;
  newJson.brand = oldJson.marque;
  newJson.model = oldJson.modele;
  newJson.year = oldJson.annee;
  newJson.energy = oldJson.nrj;
  newJson.gearbox = oldJson.vitesse;

  return newJson;
}
