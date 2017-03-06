// Collection imports
import OrganizationLogo from '/organizations/logo/collection/collection';

OrganizationLogo.allow({
  insert () {
    return true;
  },
  remove () {
    return true;
  },
  read () {
    return true;
  },
  write () {
    return true;
  },
});
