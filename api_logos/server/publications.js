import { ApiLogos } from '../collection';

Meteor.publish('allApiLogo', function() {
  return ApiLogos.find({
    'metadata._Resumable': {
      $exists: false
    }
  });
});
