// Meteor packages import
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// APINF collections import
import Organizations from '/organizations/collection/';

Template.organizationProfile.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Create placeholder for storage
  instance.dbQuery = {};
  instance.filteredApis = new ReactiveVar();
  instance.selectedFilterOption = new ReactiveVar();

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

      if (organization) {
        // Get IDs of managed APIs via collection helper
        const managedApiIds = organization.managedApiIds();
        // Subscribe to Organization APIs documents
        instance.subscribe('apisByIds', managedApiIds);
      }
    }
  });
});

Template.organizationProfile.helpers({
  organization () {
    const instance = Template.instance();

    // Get the Organization slug from the route
    const slug = FlowRouter.getParam('slug');
    // Get Organization, based on slug & Save it in template instance variable
    instance.organization = Organizations.findOne({ slug });

    // Return organization document
    return instance.organization;
  },
  filteredApisCount () {
    const instance = Template.instance();

    // Get Organization, based on slug
    const organization = instance.organization;

    // Placeholder for storaging APIs of current organization
    let organizationApis;

    // Get query parameter LifeCycle
    const lifecycleParameter = FlowRouter.getQueryParam('lifecycle');
    // Save selected option in reactive var
    instance.selectedFilterOption.set(lifecycleParameter);

    if (lifecycleParameter) {
      // Save parameter in database query options
      instance.dbQuery.lifecycleStatus = lifecycleParameter;

      // Find APIs with filter options
      organizationApis = organization.filteredApis(instance.dbQuery);
    } else {
      // Otherwise filter isn't set
      // Find all managed apis
      organizationApis = organization.apis();
    }
    // Save APIs in reactive var
    instance.filteredApis.set(organizationApis);

    // Return count of managed/filtered APIs
    return organizationApis.length;
  },
  filteredApis () {
    const instance = Template.instance();

    // Return array of organization APIs
    return instance.filteredApis.get();
  },
  selectedFilter () {
    const instance = Template.instance();

    // Return selected filter option
    return instance.selectedFilterOption.get();
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
      Modal.show('connectApiToOrganizationModal', { organization });
    } else {
      // Otherwise show error
      const message = TAPi18n.__('organizationProfile_text_error');
      sAlert.error(message);
    }
  },
  'click #reset-filter-options': () => {
    // Delete query parameter
    FlowRouter.setQueryParams({ lifecycle: null });
  },
});
