"use strict"
function ex3()
{
  var json = {
    "cars": [
      {
        "id": "p306",
        "vehicule": "peugeot 306",
        "pricePerDay": 20,
        "pricePerKm": 0.10
      }
    ],
    "rentals": [
      {
        "id": "1-pb-92",
        "driver": {
          "firstName": "Paul",
          "lastName": "Bismuth"
        },
        "carId": "p306",
        "pickupDate": "2015-09-12",
        "returnDate": "2015-09-12",
        "distance": 100
      },
      {
        "id": "2-rs-92",
        "driver": {
          "firstName": "Rebecca",
          "lastName": "Solanas"
        },
        "carId": "p306",
        "pickupDate": "2015-09-10",
        "returnDate": "2015-09-15",
        "distance": 300
      },
      {
        "id": "3-sa-92",
        "driver": {
          "firstName": " Sami",
          "lastName": "Ameziane"
        },
        "car_id": "p306",
        "pickupDate": "2015-08-31",
        "returnDate": "2015-09-13",
        "distance": 1000
      }
    ]
  };

  //functions in js_functions.js
  writtenContent += "<div class=\"ex\" tabindex=\"0\"><h3>EX3</h3><div class=\"exContent\"><br/>";

  var car = json.cars[0];
  var rentals = json.rentals;

  for(var i = 0; i < rentals.length; i++)
  {
    var nbrOfDays = getNbrOfDays(rentals[i].pickupDate, rentals[i].returnDate);
    var pricePayedForDate = getPriceFromDays(nbrOfDays, car.pricePerDay);
    var pricePayed = pricePayedForDate + car.pricePerKm*rentals[i].distance;

    var commission = rnd(0.3 * pricePayed);
    var insurance = rnd(commission * 0.5);
    var roadA = rnd(nbrOfDays * 1);
    var drivy = rnd(commission - insurance - roadA);

    writtenContent +="<b>id client : " + rentals[i].id + "</b><br/>";
    writtenContent +="prix payé : " + pricePayed + "€<br/>";
    writtenContent +="prix insurance : " + commission + "€<br/>";
    writtenContent +="prix road A : " + roadA + "€<br/>";
    writtenContent +="paiement drivy : " + drivy + "€<br/><br/>";
  }

  writtenContent +="</div></div>";
}
