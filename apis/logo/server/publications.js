import ApiLogo from '../collection';

Meteor.publish('allApiLogo', function() {
  return ApiLogo.find({
    'metadata._Resumable': {
      $exists: false
    }
  });
});
