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
  instance.unlinkedApis = new ReactiveVar();
  // Get organization id
  const organizationId = Template.currentData().organizationId;

  // Get data about apis without organization
  Meteor.call('getUnlinkedApis', organizationId, (error, apis) => {
    // Set status data is ready
    instance.dataIsReady.set(true);
    // Create & return list of objects for dropdown list
    instance.unlinkedApis.set(_.map(apis, (api) => {
      return {
        label: api.name,
        value: api._id,
      };
    })
    );
  });
});

Template.connectApiToOrganizationModal.helpers({
  organizationApisCollection () {
    // Return collection for autoform
    return OrganizationApis;
  },
  unlinkedApis () {
    const instance = Template.instance();
    // Return list of apis without organization
    return instance.unlinkedApis.get();
  },
  dataIsReady () {
    const instance = Template.instance();
    // Get status of data fetch
    return instance.dataIsReady.get();
  },
});
