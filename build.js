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

var step = require('step');

function download() {
    var pkg = require('./package.json'),
        https = require('https'),
        url = require('url'),
        githubUser, githubRepos, downloadUrl;

    // https://github.com/2betop/fis-sass.git
    if ( /([^\/]+?)\/([^\.\/]+?)\.git$/i.test( pkg.repository.url ) ) {
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
            return this.call( null, true );
        }

        // start to download.
        var options = url.parse( downloadUrl + modPath ),
            client;

        client = https.get( options, function( res ) {
            console.log("statusCode: ", res.statusCode);
            console.log("headers: ", res.headers);

            res.on('data', function(d) {
                process.stdout.write(d);
            });
        }).on('error', function(e) {
            this.call( null, true, e );
        });
    } else {
        this.call( null, true );
    }
}

function rebuild() {
    return true;
}

function install() {
    step( download, rebuild , this );
}

function test( err ) {

    // try to run the test script.
    try {
        require('./test.js');
    } catch ( e ) {
        console.error('Test failed!');
        process.exit( 1 );
    }
}

step( install, test );