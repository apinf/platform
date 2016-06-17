import { ApiLogo } from '/apis/logo/collection/collection';

Meteor.publish('allApiLogo', function() {
  return ApiLogo.find({
    'metadata._Resumable': {
      $exists: false
    }
  });
});
