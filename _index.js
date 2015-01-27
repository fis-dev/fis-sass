'use strict';

var binding, SASS_OUTPUT_STYLE, SASS_SOURCE_COMMENTS, path;

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

SASS_SOURCE_COMMENTS = {
    none: 0,
    normal: 1,
    'default': 1,
    map: 2
};


function prepareOptions( options ) {
    var paths, style, sourceComments;

    options = options || {};

    if ( options.file ) {
        throw new Error('options.file is not supported!');
    }

    sourceComments = options.source_comments || options.sourceComments;

    if (options.sourceMap && !sourceComments) {
        sourceComments = 'map';
    }

    paths = options.include_paths || options.includePaths || [];

    // if (options.sassSyntax) {
    //     options.is_indented_syntax_src = true;
    //     // options.data = sass2scss(options.data);
    // }

    return {
        data: options.data,
        paths: paths.join(path.delimiter),
        imagePath: options.image_path || options.imagePath || '',
        style: SASS_OUTPUT_STYLE[options.output_style || options.outputStyle] || 0,
        comments: SASS_SOURCE_COMMENTS[sourceComments] || 0,
        precision: parseInt(options.precision) || 5,
        omit_source_map_url: options.omit_source_map_url ? 1 : 0,
        is_indented_syntax_src: options.is_indented_syntax_src || options.sassSyntax ? 1 : 0,
        source_map_file: options.source_map_file || ''
    };
};

var sass2scss = exports.sass2scss = function(input) {
    return binding.sass2scss(input);
}

// 暂只支持options.data用法，因为fis中只会这么用。
exports.renderSync = function( options ) {
    return binding.renderSync(prepareOptions(options));
}

