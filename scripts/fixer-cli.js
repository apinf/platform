var eslintFixer = require('./eslint-fixer.js');

process.stdin
.pipe(eslintFixer())
.pipe(process.stdout);

process.stdout.on('error', process.exit);
