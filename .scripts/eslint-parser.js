// eslint-parser.js

/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

var util = require('util'),
    _ = require('lodash'),
    Transform = require('stream').Transform;

function EslintParser(options) {
  options = options || {};

  // This Parser expects objects coming in and will emit objects out
  options.objectMode = true;

  Transform.call(this, options);

  this.processingFile = {};
}

// EslintParser is a 'Transform' stream (readable and writable)
// Pipe data through it and get parsed data out of it
util.inherits(EslintParser, Transform);

EslintParser.prototype._transform = function(data, encoding, done) {
  // Since it comes from the csv-streamer, and we do not expect comma in the lines
  // each line is on data[0]
  var line = data[0];
  if (this._isHeader(line)) {
    this.processingFile['filename'] = line;
  } else {
    if (this._fileFinished(line) && !_.isEmpty(this.processingFile)) {
      this.push(this.processingFile);
      this.processingFile = {};
    } else {
      this._parseLine(line);
    }
  }
  done();
};

EslintParser.prototype._isHeader = function(line) {
  return line.startsWith('/');
}

EslintParser.prototype._fileFinished = function(line) {
  return line.length === 0;
}

EslintParser.prototype._parseLine = function(line) {
  // checks if it's a no-undef error
  if (line.indexOf('no-undef') !== -1) {
    if (!this.processingFile.hasOwnProperty('no-undef')) {
      this.processingFile['no-undef'] = new Set();
    }

    // Regular expression to match packages on the error line
    const re = /'(\w+)'/;
    // match the no-undef package
    const package = line.match(re)[1];
    this.processingFile['no-undef'].add(package);
  } else {
    // TODO: parse other eslint errors
  }
}

module.exports = function(options) {
  return new EslintParser(options);
};
