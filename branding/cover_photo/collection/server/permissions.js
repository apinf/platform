// Import meteor package
import { Roles } from 'meteor/alanning:roles';
// Import apinf collection
import CoverPhoto from '/branding/cover_photo/collection';

CoverPhoto.allow({
  insert: function (userId) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove: function (userId) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  read: function () {
    return true;
  },
  write: function () {
    return true;
  },
});
