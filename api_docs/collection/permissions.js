/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import ApiDocs from './';

ApiDocs.allow({
  insert (userId, apiDocs) {
    return apiDocs.currentUserCanEdit();
  },
  remove (userId, apiDocs) {
    return apiDocs.currentUserCanEdit();
  },
  update (userId, apiDocs) {
    return apiDocs.currentUserCanEdit();
  },
});
