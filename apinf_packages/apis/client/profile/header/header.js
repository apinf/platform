// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Apis from '/apinf_packages/apis/collection';

import '/apinf_packages/apis/client/profile/header/header.html';
import '/apinf_packages/apis/logo/view/client/view.html';
import '/apinf_packages/apis/client/profile/status/status.js';
import '/apinf_packages/apis/client/profile/lifecycle_status/lifecycle_status.js';
import '/apinf_packages/ratings/client/rating.js';
import '/apinf_packages/bookmarks/client/bookmark.js';

Template.viewApiPageHeader.helpers({
  userShouldSeeBacklogTab () {
    // Get API id
    const apiId = this.api._id;
    const api = Apis.findOne(apiId);
    // Check if API Backlog exist or user allowed to see
    if (api && (api.backlogIsNotEmpty() || api.currentUserCanManage())) {
      return true;
    }
    return false;
  },
  userShouldSeeApiMetadataTab () {
    // Get API id
    const apiId = this.api._id;

    const api = Apis.findOne(apiId);

    // Check if API Metadata exist or user allowed to see
    if (api && (api.apiMetadataIsNotEmpty() || api.currentUserCanManage())) {
      return true;
    }
    return false;
  },
  userShouldSeeApiDocsTab () {
    // Get API id
    const apiId = this.api._id;

    const api = Apis.findOne(apiId);

    // Check if API documentation exist or user allowed to see
    if (api && (api.apiDocsIsNotEmpty() || api.currentUserCanManage())) {
      return true;
    }
    return false;
  },
});
