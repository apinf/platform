import { Template } from 'meteor/templating';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

import OrganizationLogo from '/organizations/logo/collection/collection';

Template.organizationProfileHeader.onRendered(function () {
  // Assign resumable browse to element
  OrganizationLogo.resumable.assignBrowse(this.$('#organization-file-browse'));
});

Template.organizationProfileHeader.helpers({
  currentUserCanView () {
    const organization = Template.currentData().organization;

    // Show APIs tab anyway if user is admin or manager of current organization
    if (organization.currentUserCanManage()) {
      return true;
    }
    // Show APIs tab if public apis are available otherwise don't show
    return organization.hasPublicApis();
  },
});

Template.organizationProfileHeader.events({
  'click #edit-organization': function (event, templateInstance) {
    // Get organization from template instance
    const organization = templateInstance.data.organization;

    // Show organization form modal
    Modal.show('organizationForm', { organization, formType: 'update' });
  },
});
