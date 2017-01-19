// Meteor packages import
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import _ from 'lodash';

// APINF collections import
import OrganizationApis from '/organization_apis/collection';

Template.connectApiToOrganizationModal.onCreated(function () {
  const instance = this;
  // Set status data is not ready
  instance.dataIsReady = new ReactiveVar(false);
  instance.unlinkedApis = new ReactiveVar();

  // Get data about apis without organization
  Meteor.call('getCurrentUserUnlinkedApis', (error, apis) => {
    // Set status data is ready
    instance.dataIsReady.set(true);

    // Create array of unlinked API options for API select
    const unlinkedApiOptions = _.map(apis, (api) => {
      return {
        label: api.name,
        value: api._id,
      };
    });

    // Set reactive variable to contain unlinked API options
    instance.unlinkedApis.set(unlinkedApiOptions);
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
