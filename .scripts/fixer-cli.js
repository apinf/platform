/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

var eslintParser = require('./eslint-parser.js'),
    eslintFixer = require('./eslint-fixer.js'),
    csv = require('csv-streamify'),
    JSONStream = require('JSONStream');

// TODO: find a less verbose way to parse eslint errors
var csvToJson = csv({objectMode: true});

process.stdin
.pipe(csvToJson)
.pipe(eslintParser())
.pipe(eslintFixer())
.pipe(process.stdout);

process.stdout.on('error', process.exit);
