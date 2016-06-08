import { DocumentationFiles } from '/documentation/collection/collection';

DocumentationFiles.allow({
  insert: function(userId, file) {
    return Roles.userIsInRole(userId, ['manager']);
  },
  remove: function(userId, file) {
    return Roles.userIsInRole(userId, ['manager']);
  },
  read: function(userId, file) {
    return true;
  },
  write: function(userId, file, fields) {
    return true;
  }
});
