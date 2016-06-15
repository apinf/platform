import { ApiLogos } from '/apis/logo/collection/collection';

Meteor.publish('allApiLogos', function() {
  return ApiLogos.find({
    'metadata._Resumable': {
      $exists: false
    }
  });
});
