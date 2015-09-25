//Exercice 1
"use strict"
function ex2()
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
    }

    //functions in js_functions.js
    writtenContent += "<div class=\"ex\"><h3>EX2</h3><div class=\"exContent\">";

    var car = json.cars[0];
    var rentals = json.rentals;

    for(var i = 0; i < rentals.length; i++)
    {
      var price = rentals[i].distance * car.pricePerKm;
      var nbrOfDays = getNbrOfDays(rentals[i].pickupDate, rentals[i].returnDate);
      price = price + getPriceFromDays(nbrOfDays, car.pricePerDay);
      writtenContent +="id client: " + rentals[i].id + " = " + price + "€</br>";
    }

    writtenContent +="<br/></div></div>";
}
