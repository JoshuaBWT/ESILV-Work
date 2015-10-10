var writtenContent =  "<div class=\"ex\">"+
  "<h1>WS1.JavaScript</h1>" +
  "(mouseover to look, click to lock)"+
  "</div>";

function writeOnPage()
{

    document.getElementById("resultsTag").innerHTML = writtenContent;
}

function rnd(num)
{
  return Math.round(num * 100) / 100;
}


function getNbrOfDays(p, r)
{
  var ONE_DAY = 1000 * 60 * 60 * 24;
  var date1 = new Date(p);
  var date2 = new Date(r);
  var nbrOfDays = (date2.getTime() - date1.getTime())/ONE_DAY + 1;
  return nbrOfDays;
}

function getPriceFromDays(nbrOfDays, dailyPrice)
{
  var totalPrice = 0;
  if(nbrOfDays > 10)
  {
    totalPrice = nbrOfDays * dailyPrice * 0.5;
  }
  else if(nbrOfDays > 4)
  {
    totalPrice = nbrOfDays * dailyPrice * 0.7;
  }
  else if(nbrOfDays > 1)
  {
    totalPrice = nbrOfDays * dailyPrice * 0.9;
  }
  else
    totalPrice = dailyPrice;
    return totalPrice;
}

//EXERCISE 5 & 6

function result(owner, insurance, assistance, drivy)
{
    this.clients = Array();
    this.owner = owner;
    this.insurance = insurance;
    this.assistance = assistance;
    this.drivy = drivy;
};

function client(id, pickupDate, returnDate, distance, isReduction)
{
   this.id = id;
   this.pickupDate = pickupDate;
   this.returnDate = returnDate;
   this.distance = distance;
   this.isReduction = isReduction;
   this.nbrOfDays = 0;
   this.pricePayed = 0;
   this.deductibleReduction = 0;
};

client.prototype.clone = function()
{
  var newClient = new client(this.id, this.pickupDate, this.returnDate, this.distance, this.isReduction);
  newClient.nbrOfDays = this.nbrOfDays;
  newClient.pricePayed = this.pricePayed;
  newClient.deductibleReduction = this.deductibleReduction;
  return newClient;
}

result.prototype.clear = function()
{
  this.owner = 0;
  this.insurance = 0;
  this.assistance = 0;
  this.drivy = 0;
}

result.prototype.clone = function()
{
   var total = new result(this.owner, this.insurance, this.assistance, this.drivy);
   for(var i = 0; i < this.clients.length; i++)
   {
      total.clients.push(this.clients[i].clone());
   }
   return total;
}

result.prototype.display = function()
{
  writtenContent += "total <b>owner</b> : " + this.owner + "€<br/>";
  writtenContent += "total <b>insurance</b> : " + this.insurance + "€<br/>";
  writtenContent += "total <b>assistance</b> : " + this.assistance + "€<br/>";
  writtenContent += "total <b>drivy</b> : " + this.drivy + "€<br/><br/>";
  writtenContent += "<b>clients:</b><br/>";
  for(var i = 0; i < this.clients.length; i++)
  {
      writtenContent += "<b>id client:" + this.clients[i].id + "</b> : " + this.clients[i].pricePayed + "€ (of which " + this.clients[i].deductibleReduction + "€ of reduction)<br/>";
  }
  writtenContent += "<br/>";
};

result.prototype.compare = function(total2)
{
  writtenContent += "difference <b>owner</b> : " + rnd(total2.owner - this.owner) + "€<br/>";
  writtenContent += "difference <b>insurance</b> : " + rnd(total2.insurance - this.insurance) + "€<br/>";
  writtenContent += "difference <b>assistance</b> : " + rnd(total2.assistance - this.assistance)  + "€<br/>";
  writtenContent += "difference <b>drivy</b> : " +rnd (total2.drivy - this.drivy) + "€<br/><br/>";
  writtenContent += "<b>clients:</b><br/>";
  for(var i = 0; i < this.clients.length; i++)
  {
      writtenContent += "<b>id client:" + this.clients[i].id + "</b> : " + rnd(total2.clients[i].pricePayed - this.clients[i].pricePayed) +
      "€ (of which " + rnd(total2.clients[i].deductibleReduction - this.clients[i].deductibleReduction) + "€ of reduction)<br/>";
  }
  writtenContent += "";
}

function getAllDataEx5andEx6(total, car)
{
  for(var i = 0; i < total.clients.length; i++)
  {
    var nbrOfDays = getNbrOfDays(total.clients[i].pickupDate, total.clients[i].returnDate);
    var pricePayedForDate = getPriceFromDays(nbrOfDays, car.pricePerDay);
    var pricePayed = pricePayedForDate + car.pricePerKm*total.clients[i].distance;
    var deductibleReduction = 0;

    if(total.clients[i].isReduction)
      deductibleReduction = 4 * nbrOfDays;

    var owner = rnd(0.7 * pricePayed);
    var commission = rnd(0.3 * pricePayed);
    var insurance = rnd(commission * 0.5);
    var roadA = rnd(nbrOfDays * 1);
    var drivy = rnd(commission - insurance - roadA);

    pricePayed += deductibleReduction;
    drivy += deductibleReduction;

    total.owner += owner;
    total.insurance += insurance;
    total.drivy += drivy;
    total.assistance += roadA;
    total.clients[i].nbrOfDays = nbrOfDays;
    total.clients[i].pricePayed = pricePayed;
    total.clients[i].deductibleReduction = deductibleReduction;
  }
  return total;
}
