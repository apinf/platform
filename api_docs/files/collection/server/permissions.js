import { Roles } from 'meteor/alanning:roles';

import DocumentationFiles from '/api_docs/files/collection';

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
