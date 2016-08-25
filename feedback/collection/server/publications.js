import { Feedback } from '../';

Meteor.publish('apiBackendFeedback', function(apiBackendId){
  // show feedback to specific API
  return Feedback.find({apiBackendId: apiBackendId});
});
