Meteor.publish('projectLogo', function() {
  // Get ProjectLogo collection object
  return ProjectLogo.find({});
});

Meteor.publish('coverPhoto', function() {
  // Get CoverPhoto collection object
  return CoverPhoto.find({});
});

Meteor.publish('branding', function() {
  // Get Branding collection object
  return Branding.find({});
});
