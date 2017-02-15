// Collection imports
import ApiLogo from '../collection';

Meteor.publish('allApiLogo', () => {
  return ApiLogo.find({
    'metadata._Resumable': {
      $exists: false,
    },
  });
});
