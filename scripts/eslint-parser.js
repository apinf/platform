// eslint-fixer.js
var util = require('util'),
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
    this.currentFile = line;
    this.processingFile[this.currentFile] = {};
  } else {
    if (this._fileFinished(line)) {
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
  // skip if it's not parsing errors of a file.
  if (!this.currentFile) {
    return undefined;
  }

  // checks if it's a no-undef error
  if (line.indexOf('no-undef') !== -1) {
    const re = /'(\w+)'/;
    // match the no-undef package
    const package = line.match(re)[1];
    if (!this.processingFile[this.currentFile].hasOwnProperty('no-undef')) {
      this.processingFile[this.currentFile]['no-undef'] = {}
    }
    this.processingFile[this.currentFile]['no-undef'][package] = 1;
  }
  // this.processingFile[this.currentFile].push(line);
}

module.exports = function(options) {
  return new EslintParser(options);
};
