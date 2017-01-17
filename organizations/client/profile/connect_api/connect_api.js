// Meteor packages import
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// APINF collections import
import { OrganizationApis } from '/organization_apis/collection';

Template.connectApiToOrganizationModal.onCreated(function () {
  const instance = this;
  // Set status data is not ready
  instance.dataIsReady = new ReactiveVar(false);
  // Get organization id
  const organizationId = Template.currentData().organizationId;

  // Get data about apis without organization
  Meteor.call('getUnlinkedApis', organizationId, (error, apis) => {
    // Set status data is ready
    instance.dataIsReady.set(true);
    // Create & return list of objects for dropdown list
    instance.noBookedApis =  _.map(apis, (api) => {
      return {
        label: api.name,
        value: api._id,
      };
    });
  });
});

Template.connectApiToOrganizationModal.helpers({
  organizationApisCollection () {
    // Return collection for autoform
    return OrganizationApis;
  },
  noBookedApis () {
    const instance = Template.instance();
    // Return list of apis without organization
    return instance.noBookedApis;
  },
  userCanConnectApi () {
    const instance = Template.instance();
    // Get count of free apis
    return instance.noBookedApis.length > 0;
  },
  dataIsReady () {
    const instance = Template.instance();
    // Get status of data fetch
    return instance.dataIsReady.get();
  },
});
