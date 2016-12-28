import { Template } from 'meteor/templating';
import { Organizations } from '/organizations/collection';
import _ from 'lodash';

import { OrganizationApis } from '../collection';

Template.organizationApis.onCreated(function () {
  const instance = this;

  instance.subscribe('myManagedApis');
  instance.subscribe('managedOrganizationsBasicDetails');
});

Template.organizationApis.helpers({
  organizationApisCollection () {
    return OrganizationApis;
  },
  organizationApisDoc () {
    let organizationApisDoc;
    // Get data context
    const organizationId = Template.currentData().organizationId;
    const apiId = Template.currentData().apiId;

    // Check if organizationId is passed
    if (organizationId) {
      organizationApisDoc = OrganizationApis.findOne({ organizationId });
    // Check if apiId is passed
    } else if (apiId) {
      organizationApisDoc = OrganizationApis.findOne({ apiIds: { $in: [apiId] } });
    }
    return organizationApisDoc;
  },
  organizationOptions () {
    const organizations = _.map(Organizations.find().fetch(), (organization) => ({
      label: organization.name,
      value: organization._id,
    }));
    return organizations;
  },
  apiOptions () {
    // TODO: list myManagedApis
    return [
        { label: '2013', value: 2013 },
        { label: '2014', value: 2014 },
        { label: '2015', value: 2015 },
    ];
  },
});
