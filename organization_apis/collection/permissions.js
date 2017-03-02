// Collection imports
import OrganizationApis from './';

OrganizationApis.allow({
  insert () {
    return true;
  },
  update () {
    return true;
  },
  remove () {
    return true;
  },
});
