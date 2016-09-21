Meteor.startup(function () {
  // Call mail configuration update
  Meteor.call('updateMailConfiguration');
});
