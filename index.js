'use strict';

var binding, SASS_OUTPUT_STYLE, path;

path = require('path');

try {
    binding = require('./build/Release/binding.node');
} catch ( e ) {
    throw new Error('build target not found');
}

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

var sass2scss = exports.sass2scss = function( input ) {
    return binding.sass2scss( input );
};

// 暂只支持options.data用法，因为fis中只会这么用。
exports.renderSync = function( options ) {
    var newOptions;

    if ( options.file ) {
        throw new Error('options.file is not supported!');
    }

    newOptions = prepareOptions( options );

    if ( options.sass2scss ) {
        options.data = sass2scss( options.data );
    }

    return binding.renderSync(options.data, newOptions.paths.join( path.delimiter ), newOptions.style );
}

