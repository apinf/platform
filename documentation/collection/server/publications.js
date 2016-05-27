Meteor.publish('apiDocumentation', function() {
  return ApiDocumentation.find({});
});
