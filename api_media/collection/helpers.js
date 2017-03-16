/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import Apis from '/apis/collection';
import Posts from './';

Posts.helpers({
  isPostActionAllow () {
    const postApiId = this.apiId;
    const postApi = Apis.findOne(postApiId);
  // Check if current user can edit API
    const currentUserCanEdit = postApi.currentUserCanEdit();
    if (currentUserCanEdit) {
    // User is allowed to perform action
      return true;
    }
  // User is not allowded to perform action
    return false;
  },
});
