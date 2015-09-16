var writtenContent = "";

function writeOnPage()
{
    document.getElementById("resultsTag").innerHTML = writtenContent;
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
  writtenContent += "total owner : " + this.owner + "€<br/>";
  writtenContent += "total insurance : " + this.insurance + "€<br/>";
  writtenContent += "total assistance : " + this.assistance + "€<br/>";
  writtenContent += "total drivy : " + this.drivy + "€<br/>";
  writtenContent += "clients:<br/>";
  for(var i = 0; i < this.clients.length; i++)
  {
      writtenContent += "id client:" + this.clients[i].id + " : " + this.clients[i].pricePayed + "€ (of which " + this.clients[i].deductibleReduction + "€ of reduction)<br/>";
  }
  writtenContent += "<br/>";
};

result.prototype.compare = function(total2)
{
  writtenContent += "difference owner : " + (total2.owner - this.owner) + "€<br/>";
  writtenContent += "difference insurance : " + (total2.insurance - this.insurance) + "€<br/>";
  writtenContent += "difference assistance : " + (total2.assistance - this.assistance)  + "€<br/>";
  writtenContent += "difference drivy : " + (total2.drivy - this.drivy) + "€<br/>";
  writtenContent += "clients:<br/>";
  for(var i = 0; i < this.clients.length; i++)
  {
      writtenContent += "id client:" + this.clients[i].id + " : " + (total2.clients[i].pricePayed - this.clients[i].pricePayed) +
      "€ (of which " + (total2.clients[i].deductibleReduction - this.clients[i].deductibleReduction) + "€ of reduction)<br/>";
  }
  writtenContent += "<br/>";
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

    var owner = 0.7 * pricePayed;
    var commission = 0.3 * pricePayed;
    var insurance = commission * 0.5;
    var roadA = nbrOfDays * 1;
    var drivy = commission - insurance - roadA;

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
