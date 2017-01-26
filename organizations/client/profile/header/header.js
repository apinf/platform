import { Template } from 'meteor/templating';
import OrganizationLogo from '/organizations/logo/collection/collection';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.organizationProfileHeader.onRendered(function () {
  // Assign resumable browse to element
  OrganizationLogo.resumable.assignBrowse(this.$('#organization-file-browse'));
});

Template.organizationProfileHeader.helpers({
  currentUserCanView () {
    const userId = Meteor.userId();
    // Get related organization
    const organization = Template.currentData().organization;

    // Check user's role on admin
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);
    const userIsOrganizationManager = organization.managerIds.indexOf(userId) > -1;

    // Show APIs tab if user is admin or manager of current organization
    if (userIsAdmin || userIsOrganizationManager) {
      return true;
    }
    // Show APIs tab if public apis are available otherwise don't show
    return organization.availablePublicApis();
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
