//Exercice 1
"use strict"
function ex1()
{
  var rental = {
    "cars": [
      {
        "id": "p306",
        "vehicule": "peugeot 306",
        "pricePerDay": 20,
        "pricePerKm": 0.10
      },
      {
        "id": "rr-sport",
        "pricePerDay": 60,
        "pricePerKm": 0.30
      },
      {
        "id": "p-boxster",
        "pricePerDay": 100,
        "pricePerKm": 0.45
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
        "returnDate": "2015-09-14",
        "distance": 150
      },
      {
        "id": "2-rs-92",
        "driver": {
          "firstName": "Rebecca",
          "lastName": "Solanas"
        },
        "carId": "rr-sport",
        "pickupDate": "2015-09-09",
        "returnDate": "2015-09-13",
        "distance": 550
      },
      {
        "id": "3-sa-92",
        "driver": {
          "firstName": " Sami",
          "lastName": "Ameziane"
        },
        "carId": "p-boxster",
        "pickupDate": "2015-09-12",
        "returnDate": "2015-09-14",
        "distance": 100
      }
    ]
  };

  writtenContent += "<div class=\"ex\">====================EX1====================<br/>";

  function result(idP, price) {
     this.idP = idP;
     this.price = price;
  };

  result.prototype.speak = function()
  {
      writtenContent +="id Client : " +this.idP + " = " + this.price + "€<br/>";
  }

  var results = Array();

  for(var i = 0; i < rental.rentals.length; i++)
  {
    for(var j = 0; j < rental.cars.length; j++)
    {
        if(rental.rentals[i].carId == rental.cars[j].id)
        {
          var ONE_DAY = 1000 * 60 * 60 * 24
          var date1 = new Date(rental.rentals[i].pickupDate);
          var date2 = new Date(rental.rentals[i].returnDate);
          var nbrOfDays = (date2.getTime() - date1.getTime())/ONE_DAY + 1;
          var payed = rental.cars[j].pricePerKm * rental.rentals[i].distance + nbrOfDays * rental.cars[j].pricePerDay;
          results[i] = new result(rental.rentals[i].id, payed);
        }
    }
     //console.log("price = " + rental.rentals[i].distance);
  }
  for(var i = 0; i <= result.length; i++)
  {
    results[i].speak();
  }

  writtenContent +="<br/>===========================================<br/><br/></div>";
}
