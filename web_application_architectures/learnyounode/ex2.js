var data = process.argv;
var sum = 0;
for(var i = 2; i < data.length; i++)
{
	sum += Number(data[i]);
}

console.log(sum);