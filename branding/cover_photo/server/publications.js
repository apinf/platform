// Collection imports
import CoverPhoto from '/branding/cover_photo/collection';

Meteor.publish('coverPhoto', () => {
  return CoverPhoto.find({
    'metadata._Resumable': {
      $exists: false,
    },
  });
});
