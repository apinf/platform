import { OrganizationLogo } from '/organizations/logo/collection/collection';

OrganizationLogo.allow({
  insert (userId, file) {
    return true;
  },
  remove (userId, file) {
    return true;
  },
  read (userId, file) {
    return true;
  },
  write (userId, file, fields) {
    return true;
  },
});
