import { DocumentationFiles } from '/documentation/collection/collection';

DocumentationFiles.allow({
  insert: function(userId, file) {
    return true;
  },
  remove: function(userId, file) {
    return true;
  },
  read: function(userId, file) {
    return true;
  },
  write: function(userId, file, fields) {
    return true;
  }
});
