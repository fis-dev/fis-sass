// simple test

var source = 'ul{li{color:white;}}',
    expect = /^ul\s*li\s*{/i,
    sass = require('./lib/index.js');

var ret = sass.renderSync({ file: 'xxx.scss', data: source });

if ( !ret.css.match( expect ) ) {
    throw new Error( 'Some thing wrong.' );
} else {
    console.log( 'Simple test passed!');
}
