import { DocumentationFiles } from '/documentation/collection/collection';

DocumentationFiles.allow({
  insert (userId, file) {
    return Roles.userIsInRole(userId, ['admin', 'manager']);
  },
  remove (userId, file) {
    return Roles.userIsInRole(userId, ['admin', 'manager']);
  },
  read (userId, file) {
    return true;
  },
  write (userId, file, fields) {
    return true;
  },
});
