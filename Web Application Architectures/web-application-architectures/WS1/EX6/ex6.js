"use strict"
function ex6()
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
      ],
      "rentalModifications": [
        {
          "id": 1,
          "rentalId": "1-pb-92" ,
          "returnDate": "2015-09-13",
          "distance": 150
        },
        {
          "id": 2,
          "rentalId": "3-sa-92",
          "pickupDate": "2015-09-01"
        }
      ]
    };

      //functions in js_functions.js
      writtenContent +="<div class=\"ex\">====================EX6====================<br/>";
      var car = json.cars[0];
      var rentals = json.rentals;
      var modifications = json.rentalModifications;

      var total = new result(0,0,0,0);

      for(var i = 0; i < rentals.length; i++)
      {
          total.clients.push(new client(rentals[i].id, rentals[i].pickupDate, rentals[i].returnDate, rentals[i].distance, rentals[i].options.deductibleReduction));
      }

      total = getAllDataEx5andEx6(total, car)

      total.display();

      //modifictations du JSON car champs mal nommés et/ou mal placés
      writtenContent +="After modifictations:<br/><br/>";

      var total2 = total.clone();
      total2.clear();

      for(var i = 0; i < modifications.length; i++)
      {
          for(var j = 0; j < total2.clients.length; j++)
          {
              if(modifications[i].rentalId == total.clients[j].id)
              {
                    if(modifications[i].pickupDate != null)
                      total2.clients[j].pickupDate = modifications[i].pickupDate;
                    if(modifications[i].returnDate != null)
                      total2.clients[j].returnDate = modifications[i].returnDate;
                    if(modifications[i].distance != null)
                      total2.clients[j].distance = modifications[i].distance;
              }
          }
      }

      total2 = getAllDataEx5andEx6(total2, car)
      total2.display();

      writtenContent +="Comparison : <br/><Br/>";

      total.compare(total2);

      writtenContent +="===========================================<br/><br/></div>";
}
