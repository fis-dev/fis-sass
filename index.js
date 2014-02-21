var binding = require('./build/Release/binding.node');

var ret = binding.renderSync('ul{li{color:#333;}}', '', '', 0, 0);
console.log( ret );