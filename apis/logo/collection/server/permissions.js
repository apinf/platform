import { Roles } from 'meteor/alanning:roles';

import ApiLogo from '../';


ApiLogo.allow({
  // eslint-disable-next-line no-unused-vars
  insert (userId, file) {
    return Roles.userIsInRole(userId, ['admin', 'manager']);
  },
  // eslint-disable-next-line no-unused-vars
  remove (userId, file) {
    return Roles.userIsInRole(userId, ['admin', 'manager']);
  },
  // eslint-disable-next-line no-unused-vars
  read (userId, file) {
    return true;
  },
  // eslint-disable-next-line no-unused-vars
  write (userId, file, fields) {
    return true;
  },
});
