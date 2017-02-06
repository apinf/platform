import { Meteor } from 'meteor/meteor';
import ApiLogo from '../collection';

Meteor.publish('allApiLogo', () => {
  return ApiLogo.find({
    'metadata._Resumable': {
      $exists: false,
    },
  });
});
