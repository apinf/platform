Meteor.publish('projectLogo', function() {
  return ProjectLogo.find();
});
