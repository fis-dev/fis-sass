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


var ret = sass.renderSync({
    file: 'aaa.scss',
    data: '@import "xxx";\n'+source,
    importer: function(url, pre, done) {
        return {
            contents: "body{color: red}"
        }
    }
});

if ( !~ret.css.indexOf('color: white;') ) {
    throw new Error( 'Some thing wrong.' );
} else {
    console.log( 'importer is supported');
}

