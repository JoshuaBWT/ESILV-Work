var vm = require("vm");
var fs = require("fs");

//module pour importer des fonctions javascript externes voir utils/utils.js
module.exports = function(path, context) {
  context = context || {};
  var data = fs.readFileSync(path);
  vm.runInNewContext(data, context, path);
  return context;
}
