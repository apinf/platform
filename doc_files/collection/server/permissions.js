import { Roles } from 'meteor/alanning:roles';

import DocumentationFiles from '/doc_files/collection';

DocumentationFiles.allow({
  insert (userId) {
    return Roles.userIsInRole(userId, ['admin', 'manager']);
  },
  remove (userId) {
    return Roles.userIsInRole(userId, ['admin', 'manager']);
  },
  read () {
    return true;
  },
  write () {
    return true;
  },
});
