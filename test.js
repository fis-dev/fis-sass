// simple test

var source = 'ul{li{color:white;}}',
    expect = /^ul\s*li\s*{/i,
    sass = require('./index.js');

if ( !sass.renderSync({ data: source }).match( expect ) ) {
    throw new Error( 'Some thing wrong.' );
} else {
    console.log( 'Simple test passed!');
}


var fs = require('fs');
source = fs.readFileSync('test.sass', 'utf-8');
expect = fs.readFileSync('expect.css', 'utf-8');
if ( sass.renderSync({ data: source, sass2scss: true }) === expect ) {
    console.log( 'Sass syntax supported.');
} else {
    console.log( 'Sass syntax unsupported.');
}