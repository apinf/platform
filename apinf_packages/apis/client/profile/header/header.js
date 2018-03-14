// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Apis from '/apinf_packages/apis/collection';

Template.viewApiPageHeader.onRendered(() => {
  // Get current url hash value
  const hashTabValue = location.hash.substr(1);

  // If url contain hash value
  if (hashTabValue) {
    // Show tab
    $(`.nav-tabs a[href='#${hashTabValue}']`).tab('show');
  }
});

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

Template.viewApiPageHeader.events({
  'click #api-navigation-tabs li > a': (event) => {
    // Show hash value in url
    window.location = `${event.currentTarget.hash}`;
  },
});
