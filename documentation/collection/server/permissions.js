import { DocumentationFiles } from '/documentation/collection/collection';

DocumentationFiles.allow({
  insert: function(userId, file) {
    return Roles.userIsInRole(userId, ['admin','manager']);
  },
  remove: function(userId, file) {
    return Roles.userIsInRole(userId, ['admin','manager']);
  },
  read: function(userId, file) {
    return true;
  },
  write: function(userId, file, fields) {
    return true;
  }
});
