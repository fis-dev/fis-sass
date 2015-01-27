/**
 * This script will be excuted while npm installing this package.
 *
 * The flow will be.
 * 1. Accroding to the client's platform and try to download an addon binary
 *    package from github.
 * 2. Try the addon if fail then try `node-gyp` to rebuild a new addon bindary
 *    package.
 * 3. Run the test script.
 */

var step = require('step'),
    fs = require('fs'),
    path = require('path'),
    util = require('./util.js');

// Try to download binding.node from github.
function download() {
    var pkg = require('./package.json'),
        https = require('https'),
        url = require('url'),
        done = this,
        githubUser, githubRepos, downloadUrl;

    if (pkg.bindingsCDN) {
        downloadUrl = pkg.bindingsCDN;
    } else if ( /([^\/]+?)\/([^\.\/]+?)\.git$/i.test( pkg.repository.url ) ) {
        githubUser = RegExp.$1;
        githubRepos = RegExp.$2;
        downloadUrl = 'https://raw.github.com/' + githubUser + '/' +
                githubRepos + '/master/bindings/';
    }

    // Accroding to the client's platform and try to download an addon binary
    // package from github.
    if ( downloadUrl ) {
        var map = require('./map.json'),
            candidates, version, modPath, candidate;

        version = process.versions.node;
        candidates = map[ process.platform + '-' + process.arch ] || [];

        function versionCompare(left, right) {
            if (typeof left + typeof right != 'stringstring')
                return false;

            var a = left.split('.'),
                b = right.split('.'),
                i = 0,
                len = Math.max(a.length, b.length);

            for (; i < len; i++) {
                if ((a[i] && !b[i] && parseInt(a[i], 10) > 0) || (parseInt(a[i], 10) > parseInt(b[i], 10))) {
                    return 1;
                } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i], 10) < parseInt(b[i], 10))) {
                    return -1;
                }
            }

            return 0;
        }

        if ( candidates.length ) {
            do {
                candidate = candidates.pop();

                if ( versionCompare( version, candidate ) >= 0 ) {
                    break;
                }

            } while ( candidates.length );

            modPath = process.platform + '-' + process.arch + '/' +
                    candidate + '/binding.node';
        } else {
            console.error( 'Can\'t find the binding.node file.' );
            return done( true );
        }

        // start to download.
        var dest = './vendor/' +process.platform + '-' + process.arch+ '/binding.node';

        if ( fs.existsSync( dest ) ) {
            console.log( 'The binding.node file exist, skip download.' );
            done( false );
            return;
        }

        util.download({
            remote: downloadUrl + modPath,
            dest: dest
        }, done);

    } else {
        done( true );
    }
}

// try to rebuild this.
function rebuild( error ) {
    var done = this,
        cp = require('child_process');

    cp.spawn(
        process.platform === 'win32' ? 'node-gyp.cmd' : 'node-gyp', ['rebuild'], {
        customFds: [0, 1, 2]
    })
    .on('exit', function(err) {
        if (err) {
            if (err === 127) {
                console.error(
                    'node-gyp not found! Please upgrade your install of npm! You need at least 1.1.5 (I think) ' +
                    'and preferably 1.1.30.'
                );
            } else {
                console.error('Build failed');
            }

            done( err );
        }

        done( false );
    });
}

function test( err ) {
    // try to run the test script.
    if ( !err ) {
        try {
            delete require.cache[require.resolve('./test.js')];
            delete require.cache[require.resolve('./lib/index.js')];

            require('./test.js');
            this( false );
        } catch ( e ) {
            console.error('Test failed!');
            err = true;
        }
    }

    this( err );
}

step( download, test, function( error ) {
    // Do I need to rebuild?
    if ( error ) {
        step( rebuild, test, this );
    } else {
        return;
    }
}, function( error ) {
    process.exit( error ? 1 : 0 );
});
