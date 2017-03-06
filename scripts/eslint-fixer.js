// eslint-fixer.js
var util = require('util'),
    fs = require('fs'),
    Transform = require('stream').Transform;

function EslintFixer(options) {
  options = options || {};

  // This Fixer expects objects coming in and will emit objects out
  options.objectMode = true;

  Transform.call(this, options);

  this.processingFile = {};
}

// EslintFixer is a 'Transform' stream (readable and writable)
// Pipe data through it and get parsed data out of it
util.inherits(EslintFixer, Transform);

EslintFixer.prototype._transform = function(data, encoding, done) {

  // Data comes in the format
  // { filename: '/full-path-to/file.js', 'no-undef': Set { 'Template', 'Meteor' } }
  if (data.hasOwnProperty('no-undef')) {
    var packages = Array.from(data['no-undef']);
    packages.sort();
    this._fixNoUndef(data.filename, packages);
  }
  done();

};

EslintFixer.prototype._fixNoUndef = function(file, packages) {
  const templates = {
    Meteor: 'import { Meteor } from \'meteor/meteor\';',
    Mongo: 'import { Mongo } from \'meteor/mongo\';',
    ReactiveVar: 'import { ReactiveVar } from \'meteor/reactive-var\';',
    Template: 'import { Template } from \'meteor/templating\';',
    check: 'import { check } from \'meteor/check\';',
  }

  // Get desired import declarations
  var declarations = ['// Meteor packages imports'];
  for (package of packages) {
    declarations.push(templates[package]);
  }
  declarations.push('\n');

  // Read existing contents into data
  var originalLines = fs.readFileSync(file).toString().split('\n');

  // Remove first line if it begins with a certain comment
  if (originalLines[0].startsWith('// Meteor packages imports')) {
    originalLines.splice(0, 1, '// Meteor contributed packages imports');
  }

  // Insert the declarations as strings in a buffer
  var buffer = new Buffer(declarations.join('\n'));

  // Insert the original file strings in a buffer
  var data = new Buffer(originalLines.join('\n'));

  // Open file for writting
  var fd = fs.openSync(file, 'w+');

  // Write new data
  fs.writeSync(fd, buffer, 0, buffer.length, 0);

  // Write old data
  fs.writeSync(fd, data, 0, data.length, buffer.length);

  // Close file descriptor
  fs.close(fd);
}

module.exports = function(options) {
  return new EslintFixer(options);
};
