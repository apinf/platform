/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import Apis from '/imports/apis/collection';
import Organizations from '/packages/organizations/collection';
import Posts from './';

Posts.helpers({
  userCanEditPost () {
    let currentUserCanManage = false;
    const postEntityId = this.entityId;
    // checking of entity in question
    if (this.entityType === 'api') {
      // Check API
      const postApi = Apis.findOne(postEntityId);
      // Check if current user can edit API
      currentUserCanManage = postApi.currentUserCanManage();
    } else if (this.entityType === 'organization') {
      // Check Organizations
      const postOrg = Organizations.findOne(postEntityId);
      // Check if current user can edit API
      currentUserCanManage = postOrg.currentUserCanManage();
    }

    return currentUserCanManage;
  },
});
