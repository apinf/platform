var eslintParser = require('./eslint-parser.js'),
    csv = require('csv-streamify'),
    JSONStream = require('JSONStream');

var csvToJson = csv({objectMode: true});

process.stdin
.pipe(csvToJson)
.pipe(eslintParser())
.pipe(JSONStream.stringify(false))
.pipe(process.stdout);

process.stdout.on('error', process.exit);
