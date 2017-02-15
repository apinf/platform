// eslint-fixer.js
var util = require('util')
  , Transform = require('stream').Transform;

function EslintFixer(options) {
  options = options || {};

  // This Fixer expects objects coming in and will emit objects out
  options.objectMode = true;

  Transform.call(this, options);

  this._files = {};
  this.processingFile = false;
}

// EslintFixer is a 'Transform' stream (readable and writable)
// Pipe data through it and get parsed data out of it
util.inherits(EslintFixer, Transform);

EslintFixer.prototype._transform = function(data, encoding, done) {
   this.push(data);
   done();
};
//
// // Pipe the streams
// process.stdin
// .pipe(parser)
// .pipe(process.stdout);
//
// // Some programs like `head` send an error on stdout
// // when they don't want any more data
// process.stdout.on('error', process.exit);


module.exports = function(options) {
  return new EslintFixer(options);
};
