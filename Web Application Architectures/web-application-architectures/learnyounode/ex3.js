var fs = require('fs');
var filePath = process.argv[2];
var fileContent = fs.readFileSync(filePath).toString();

var count = fileContent.split('\n').length - 1;

console.log(count);