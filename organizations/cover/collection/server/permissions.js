/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import OrganizationCover from '/organizations/cover/collection/collection';

OrganizationCover.allow({
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
