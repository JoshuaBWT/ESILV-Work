"use strict"
function ex5()
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
          "distance": 100,
          "options":{
            "deductibleReduction": false
          }
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
          "distance": 300,
          "options":{
            "deductibleReduction": true
          }
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
          "distance": 1000,
          "options":{
            "deductibleReduction": true
          }
        }
      ]
    };

      //functions in js_functions.js
      writtenContent += "<div class=\"ex\" tabindex=\"0\"><h3>EX5</h3><div class=\"exContent\"><br/>";
      var car = json.cars[0];
      var rentals = json.rentals;

      var total = new result(0,0,0,0);

      for(var i = 0; i < rentals.length; i++)
      {
          total.clients.push(new client(rentals[i].id, rentals[i].pickupDate, rentals[i].returnDate, rentals[i].distance, rentals[i].options.deductibleReduction));
      }

      total = getAllDataEx5andEx6(total, car);

      total.display();

      writtenContent +="<br/></div></div>";
}
