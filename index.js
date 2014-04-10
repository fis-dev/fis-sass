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
    var paths, style, comments, sass2scss;

    options = typeof options !== 'object' ? {} : options;
    paths = options.include_paths || options.includePaths || [];
    style = SASS_OUTPUT_STYLE[options.output_style || options.outputStyle] || 0;

    if ( typeof options.sass2scss === 'undefined' && options.data ) {
        options.sass2scss = !~options.data.indexOf('{');
    }

    return {
        paths: paths,
        style: style,
        sass2scss: options.sass2scss ? 1: 0
    };
};

// 暂只支持options.data用法，因为fis中只会这么用。
exports.renderSync = function( options ) {
    var newOptions;

    if ( options.file ) {
        throw new Error('options.file is not supported!');
    }

    newOptions = prepareOptions( options );

    return binding.renderSync(options.data, newOptions.paths.join( path.delimiter ), newOptions.style, 0, newOptions.sass2scss);
}