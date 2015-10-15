Package.describe({
  name: 'user-feedback',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'User feedback package for Meteor',
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
  api.addFiles('feedback.png','client');
  api.addFiles('user-feedback.html','client');
  api.addFiles('user-feedback.js','client');
  api.addFiles('user-feedback.css','client');
  api.addFiles('user-feedback-server.js','server');
});
