// simply try the test script.

try {
    require('./test.js');
} catch( e ) {

    console.log( e.message );
    console.error('Install fail');

    process.exit(1);
}


