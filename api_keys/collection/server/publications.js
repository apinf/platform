// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import ApiKeys from '/api_keys/collection';

// Returns logged in user's all API keys (Eg. Umbrella, Kong keys)
Meteor.publish('apiKeysForCurrentUser', function () {
  const currentUserId = this.userId;

  return ApiKeys.find({ userId: currentUserId });
});
