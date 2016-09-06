import { ApiKeys } from '/apikeys/collection';

Meteor.publish('apiKeysForCurrentUser', function () {
  const currentUserId = this.userId;

  return ApiKeys.find({ 'userId': currentUserId });
});
