import { ApiBacklogItems } from '/backlog/collection';

Meteor.publish('apiBacklogItems', function(apiBackendId){

  // returning backlog items object for current apibackend
  return ApiBacklogItems.find({ apiBackendId: apiBackendId });
});
