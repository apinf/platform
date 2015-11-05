Meteor.publish('projectLogo', function() {
  return ProjectLogo.find({});
});

Meteor.publish('branding', function() {
  return Branding.find({});
});
