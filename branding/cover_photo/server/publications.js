// Import Meteor package
import { Meteor } from 'meteor/meteor';
// Import apinf collection
import CoverPhoto from '/branding/cover_photo/collection';

Meteor.publish('coverPhoto', () => {
  return CoverPhoto.find({
    'metadata._Resumable': {
      $exists: false,
    },
  });
});
