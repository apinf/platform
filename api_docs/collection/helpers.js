/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import Apis from '/apis/collection';
import ApiDocs from './';

ApiDocs.helpers({
  currentUserCanEdit () {
    // Get related API id
    const docApiId = this.apiId;

    if (docApiId) {
      // Get API
      const docApi = Apis.findOne(docApiId);

      if (docApi) {
        // Check if current user can edit API
        const currentUserCanEdit = docApi.currentUserCanManage();

        if (currentUserCanEdit) {
          // User is allowed to perform action
          return true;
        }
      }
    }
    // User is not allowded to perform action
    return false;
  },
});
