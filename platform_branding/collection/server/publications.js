Meteor.publish('branding', function() {
  // Get Branding collection object
  return Branding.find({});
});
