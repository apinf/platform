Package.describe({
  name: 'viloma:user-feedback',
  version: '0.5.4',
  // Brief, one-line summary of the package.
  summary: 'A self-contained user feedback module for Meteor - with Chat',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/vivekvrao/user-feedback.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('mongo', ['server','client']);
  api.use('templating');
  api.use('accounts-base');
  api.addFiles('chat.png','client');
  api.addFiles('feedback.png','client');
  api.addFiles('user-feedback.html','client');
  api.addFiles('user-feedback.js','client');
  api.addFiles('user-feedback-chat.html','client');
  api.addFiles('user-feedback-chat.js','client');
  api.addFiles('user-feedback.css','client');
  api.addFiles('user-feedback-server.js','server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('viloma:user-feedback');
  api.addFiles('user-feedback-tests.js');
});
