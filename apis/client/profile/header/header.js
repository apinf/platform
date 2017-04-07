// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Apis from '/apis/collection';

Template.viewApiPageHeader.helpers({
  userShouldSeeBacklogTab () {
    // Get API id
    const apiId = this.api._id;

    const api = Apis.findOne(apiId);

    // Check if API Backlog exist or user allowed to see
    if (api.backlogIsNotEmpty() || api.currentUserCanManage()) {
      return true;
    }
    return false;
  },
  userShouldSeeApiMetadataTab () {
    // Get API id
    const apiId = this.api._id;

    const api = Apis.findOne(apiId);

    // Check if API Metadata exist or user allowed to see
    if (api.apiMetadataIsNotEmpty() || api.currentUserCanManage()) {
      return true;
    }
    return false;
  },
});
