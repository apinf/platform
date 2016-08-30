import { ApiBacklogItems } from '/backlog/collection';

Meteor.publish('apiBacklogItems', function(apiBackendId){

  return ApiBacklogItems.find({ apiBackendId: apiBackendId });
});
