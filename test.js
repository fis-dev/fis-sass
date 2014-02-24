// simple test

var source = 'ul{li{color:white;}}',
    expect = /^ul\s*li\s*{/i,
    sass = require('./index.js');

if ( !sass.renderSync({ data: source }).match( expect ) ) {
    throw new Error( 'Some thing wrong.' );
} else {
    console.log( 'Simple test passed!');
}