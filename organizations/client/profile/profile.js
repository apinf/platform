// Meteor packages import
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// APINF collections import
import { Organizations } from '/organizations/collection/';

Template.organizationProfile.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.autorun(() => {
    // Get the Organization slug from the route
    const organizationSlug = FlowRouter.getParam('slug');

    // Make sure organizationSlug exists,
    // fixes bug when changing route to navigate to different page
    if (organizationSlug) {
      // Reactively subscribe to a single Organization
      // Makes sure proper data is available when editing organization name
      instance.subscribe('singleOrganization', organizationSlug);

      // Subscribe to OrganizationAPIs link documents
      instance.subscribe('organizationApiLinksByOrganizationSlug', organizationSlug);

      // Get Organization document
      const organization = Organizations.findOne({ slug: organizationSlug });

      // Get all Organization API links
      const apiLinks = OrganizationApis.find({ organizationId: organization._id });

      // Create an array of Organization API IDs
      const apiIds = _.map(apiLinks, function (apiLink) {
        return apiLink.apiId;
      });

      // Subscribe to Organization APIs documents
      instance.subscribe('apisById', apiIds);
    }
  });
});

Template.organizationProfile.helpers({
  organization () {
    // Get the Organization slug from the route
    const slug = FlowRouter.getParam('slug');

    // Get Organization, based on slug
    return Organizations.findOne({ slug });
  },
  managedApis () {
    // Get the Organization slug from the route
    const slug = FlowRouter.getParam('slug');

    // Init managedApis
    let managedApis;

    // Get Organization, based on slug
    const organization = Organizations.findOne({ slug });

    // Check organization exist
    if (organization) {
      // Get organization apis
      managedApis = organization.apis();
    }

    // Return managedApis
    return managedApis;
  },
  managedApisCount () {
    // Get the Organization slug from the route
    const slug = FlowRouter.getParam('slug');

    // Init managedApisCount
    let managedApisCount = 0;

    // Get Organization, based on slug
    const organization = Organizations.findOne({ slug });

    // Check organization exist
    if (organization) {
      // Get organization apis count
      managedApisCount = organization.apisCount();
    }

    // Return managedApisCount
    return managedApisCount;
  },
});

Template.organizationProfile.events({
  'click #connect-api': () => {
    // Get the Organization slug from the route
    const slug = FlowRouter.getParam('slug');
    // Get Organization, based on slug
    const organization = Organizations.findOne({ slug });

    // Check organization exist
    if (organization) {
      // Show modal with list of suggested apis and id of current organization
      Modal.show('connectApiToOrganizationModal', { organizationId: organization._id });
    } else {
      // Otherwise show error
      const message = TAPi18n.__('organizationProfile_text_error');
      sAlert.error(message);
    }
  },
});
