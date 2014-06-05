var _ = module.exports;
var path = require('path');
var fs = require('fs');

_.mkdirp = function mkdirP ( p, mode, made ) {
    if (mode === undefined) {
        mode = 0777 & (~process.umask());
    }
    if (!made) made = null;

    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    try {
        fs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = mkdirP(path.dirname(p), mode, made);
                mkdirP(p, mode, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = fs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
}

_.download = function(opt, done) {
    var remote = opt.remote;
    var dest = opt.dest;
    var url = require('url');
    var fs = require('fs');
    var options = url.parse(remote);
    var notifiedSize = opt.notifiedSize || 512 * 1024;
    var http = options.protocol === 'https:' ? require('https') : require('http')
    var client;

    process.stdout.write('Downloading ' + remote + ' ...\n');

    client = http.get( options, function( res ) {
        var count = 0,
            notifiedCount = 0,
            outFile;

        if ( res.statusCode === 200 ) {
            _.mkdirp(path.dirname(dest));

            outFile = fs.openSync( dest, 'w' );

            res.on('data', function( data ) {
                fs.writeSync(outFile, data, 0, data.length, null);
                count += data.length;

                if ( (count - notifiedCount) > notifiedSize ) {
                  process.stdout.write('Received ' + Math.floor( count / 1024 ) + 'K...\n');
                  notifiedCount = count;
                }
            });

            res.addListener('end', function() {
                process.stdout.write('Received ' + Math.floor(count / 1024) + 'K total.\n');
                fs.closeSync( outFile );
                done( false );
            });

        } else if (res.statusCode === 302 && res.headers.location) {
            client.abort();
            opt.remote = res.headers.location;

            process.stdout.write('Redirct to ' + opt.remote + '\n');
            _.download(opt, done);
        } else {
            client.abort();
            done('Error requesting archive')
        }
    }).on('error', function(e) {
        done(e.message || 'unkown error');
    });
}