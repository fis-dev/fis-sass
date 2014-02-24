var binding, SASS_OUTPUT_STYLE, path;

var map = require('./lib/map.json'),
    candidates, version, modPath, candidate;

version = process.versions.node;
candidates = map[process.platform + '-' + process.arch] || [];

function greaterThanOrEqual(a, b) {
    return parseInt(a.replace(/\./g, '00')) >=
        parseInt(b.replace(/\./g, '00'));
}

if (candidates.length) {
    do {
        candidate = candidates.pop();

        if (greaterThanOrEqual(version, candidate)) {
            break;
        }

    } while (candidates.length);

    modPath = './lib/' + process.platform + '-' + process.arch + '/' +
        candidate + '/binding.node';
} else {
    console.error( 'Install failed!' );
    process.exit(1);
}

binding = require(modPath);


var source = 'ul{li{color:white;}}',
    expect = /^ul\s*li\s*{/i;

if ( !binding.renderSync(source).match( expect ) ) {
    throw new Error( 'Some thing wrong.' );
} else {
    console.log( 'Simple test passed!');
}