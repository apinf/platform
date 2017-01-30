// Meteor packages import
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';
// APINF collection imports
import Apis from '/apis/collection';

Template.organizationApis.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Create placeholder for storage
  instance.managedApis = new ReactiveVar();
  instance.selectedFilterOption = new ReactiveVar();

  // Get Organization document from template data
  const organization = instance.data.organization;

  instance.autorun(() => {
    // Subscribe to OrganizationAPIs link documents
    instance.subscribe('organizationApiLinksByOrganizationSlug', organization.slug);

    const managedApiIds = organization.managedApiIds();

    // Checking of organization manager role
    if (organization.currentUserCanManage()) {
      // If user is admin or organization manager then publish all managed APIs
      instance.subscribe('allOrganizationApisByIds', managedApiIds);
    } else {
      // Otherwise publish all available managed APIs for current user
      instance.subscribe('organizationPublicApisByIds', managedApiIds);
    }
  });

  // Watching for changes of query parameters
  instance.autorun(() => {
    // Placeholder
    let managedApis;

    // Get query parameter LifeCycle
    const lifecycleParameter = FlowRouter.getQueryParam('lifecycle');

    // Save selected option in reactive var
    instance.selectedFilterOption.set(lifecycleParameter);

    // Checking of filter was set
    if (lifecycleParameter) {
      // Filter data by selected parameter
      managedApis = Apis.find({ lifecycleStatus: lifecycleParameter }).fetch();
    } else {
      // Otherwise show all managed apis
      managedApis = Apis.find().fetch();
    }

    // Save list of managed APIs in instance reactive variable
    instance.managedApis.set(managedApis);
  });
});

Template.organizationApis.helpers({
  apisCount () {
    const instance = Template.instance();
    // Get managed/filtered APIs
    const managedApis = instance.managedApis.get();

    // Return count of managed/filtered apis
    return managedApis.length;
  },
  apis () {
    const instance = Template.instance();

    // Return list of managed/filtered Apis
    return instance.managedApis.get();
  },
  selectedFilter () {
    const instance = Template.instance();

    // Return selected filter option
    return instance.selectedFilterOption.get();
  },
});

Template.organizationApis.events({
  'click #connect-api': () => {
    // Get Organization from template instance
    const organization = Template.currentData().organization;

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
