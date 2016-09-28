import { ProjectLogo } from '/branding/logo/collection';

ProjectLogo.allow({
  insert: function(userId, file) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove: function(userId, file) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  read: function(userId, file) {
    return true;
  },
  write: function(userId, file, fields) {
    return true;
  }
});
