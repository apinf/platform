import { ApiBacklogItems } from '/backlog/collection';

Meteor.publish('apiBacklogItems', function(apiBackendId){
  // Return backlog items for a given API
  return ApiBacklogItems.find({ apiBackendId: apiBackendId });
});
