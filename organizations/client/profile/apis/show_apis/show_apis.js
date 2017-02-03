import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Apis from '/apis/collection';

Template.organizationShowApis.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Create placeholder for storage
  instance.managedApis = new ReactiveVar();
  instance.selectedFilterOption = new ReactiveVar();

  // Get Organization document from template data
  const organization = instance.data.organization;

  // Watching for changes of query parameters
  instance.autorun(() => {
    const managedApiIds = organization.managedApiIds();

    // Placeholder
    let managedApis;

    // Get query parameter LifeCycle
    const lifecycleParameter = FlowRouter.getQueryParam('lifecycle');

    // Save selected option in reactive var
    instance.selectedFilterOption.set(lifecycleParameter);

    // Checking of filter was set
    if (lifecycleParameter) {
      // Filter data by selected parameter
      managedApis = Apis.find({
        _id: { $in: managedApiIds },
        lifecycleStatus: lifecycleParameter,
      }).fetch();
    } else {
      // Otherwise show all managed apis
      managedApis = Apis.find({ _id: { $in: managedApiIds } }).fetch();
    }

    // Save list of managed APIs in instance reactive variable
    instance.managedApis.set(managedApis);
  });
});

Template.organizationShowApis.helpers({
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

Template.organizationShowApis.events({
  'click #reset-filter-options': () => {
    // Delete query parameter
    FlowRouter.setQueryParams({ lifecycle: null });
  },
});
