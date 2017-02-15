// Npm packages imports
import _ from 'lodash';

// Collection imports
import OrganizationApis from '/organization_apis/collection';

Template.connectApiToOrganizationModal.onCreated(function () {
  const instance = this;
  instance.unlinkedApis = new ReactiveVar();

  // Get data about apis without organization
  Meteor.call('getCurrentUserUnlinkedApis', (error, apis) => {
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
});
