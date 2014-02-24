'use strict';

var binding, SASS_OUTPUT_STYLE, path;

function requireBinding() {
    var map = require('./lib/map.json'),
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

        modPath = './lib/' + process.platform + '-' + process.arch + '/' +
                candidate + '/binding.node';
    } else {
        throw new Error( 'Can\'t load addon.' );
    }

    return require( modPath );
}

path = require('path');
binding = requireBinding();

SASS_OUTPUT_STYLE = {
    nested: 0,
    expanded: 1,
    compact: 2,
    compressed: 3
};

function prepareOptions( options ) {
    var paths, style, comments;

    options = typeof options !== 'object' ? {} : options;
    paths = options.include_paths || options.includePaths || [];
    style = SASS_OUTPUT_STYLE[options.output_style || options.outputStyle] || 0;

    return {
        paths: paths,
        style: style
    };
};

// 暂只支持options.data用法，因为fis中只会这么用。
exports.renderSync = function( options ) {
    var newOptions;

    if ( options.file ) {
        throw new Error('options.file is not supported!');
    }

    newOptions = prepareOptions( options );

    return binding.renderSync(options.data, newOptions.paths.join( path.delimiter ), newOptions.style);
}