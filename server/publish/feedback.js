Meteor.publish('apiBackendFeedback', function(apiBackendId){
  // If user is admin - show all feedback
  console.log(apiBackendId);
  return Feedback.find({apiBackendId: apiBackendId});
});
