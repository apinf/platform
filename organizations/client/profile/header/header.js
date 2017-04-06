/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// importing flow-router
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import OrganizationLogo from '/organizations/logo/collection/collection';

Template.organizationProfileHeader.onRendered(function () {
  // Assign resumable browse to element
  OrganizationLogo.resumable.assignBrowse(this.$('#organization-file-browse'));
});

Template.organizationProfileHeader.events({
  'click #edit-organization': function (event, templateInstance) {
    // Get organization from template instance
    const organization = templateInstance.data.organization;

    // Show organization form modal
    Modal.show('organizationForm', { organization, formType: 'update' });
  },
});

Template.organizationProfileHeader.events({
  'click #organization-apis-tab': function () {
    // Quick and dirty solution, to be fixed later
    // Because after updating URL, the oembed does not refresh
    // Using flow-router, a refresh is called
    const context = FlowRouter.current();
    FlowRouter.go('/');
    FlowRouter.go(context.path);
  },
});
