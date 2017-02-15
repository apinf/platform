// Import Meteor packages
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import CoverPhoto from '/branding/cover_photo/collection';

CoverPhoto.allow({
  insert (userId) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove (userId) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  read () {
    return true;
  },
  write () {
    return true;
  },
});
