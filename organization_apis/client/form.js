import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Organizations } from '/organizations/collection';
import { ApiMetadata } from '/metadata/collection';
import _ from 'lodash';

import { OrganizationApis } from '../collection';

Template.organizationApis.onCreated(function () {
  const instance = this;

  // Get API ID from the route
  instance.apiId = FlowRouter.getParam('_id');

  instance.subscribe('myManagedApis');
  instance.subscribe('managedOrganizationsBasicDetails');
  instance.subscribe('organizationApisByApiId', instance.apiId);
});

Template.organizationApis.helpers({
  organizationApisCollection () {
    return OrganizationApis;
  },
  formType () {
    const instance = Template.instance();
    // Get API ID
    const apiId = instance.data.apiId;

    // Look for existing organizationApis document
    const existingOrganizationApis = OrganizationApis.findOne({ apiIds: { $in: [apiId] } });
    // If organizationApis exist then type will be update otherwise type will be insert
    if (existingOrganizationApis) {
      instance.formType = 'update';
    } else {
      instance.formType = 'insert';
    }

    return instance.formType;
  },
  userIsOrganizationManager () {
    const organizationsCount = Organizations.find().count();

    return organizationsCount > 0;
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

Template.organizationApis.events({
  'click #organization-apis-save': (event, templateInstance) => {
    // Get current API id
    const apiId = templateInstance.data.apiId;

    // Get the selected organization id
    const organizationId = templateInstance.$('[name=organizationId]').val();

    // Try to find organization document
    const organization = Organizations.findOne(organizationId);
    // Try to find metadata document of current API
    const metadata = ApiMetadata.findOne({ apiBackendId: apiId });
    // Get metadata id otherwise it will be empty string
    const metadataId = metadata ? metadata._id : '';

    // If organization document was found
    if (organization) {
      // Fill a object with organization information for metadata
      const metadataInformation = {
        organization: {
          name: organization.name,
          description: organization.description,
        },
        contact: {
          name: organization.contact.person,
          phone: organization.contact.phone,
          email: organization.contact.email,
        },
      };

      // If metadata document already exists
      if (metadata) {
        // Update information
        ApiMetadata.update(metadataId, { $set: metadataInformation });
      } else {
        // Add information about API
        metadataInformation.apiBackendId = apiId;
        // Create a new one metadata
        ApiMetadata.insert(metadataInformation);
      }
    } else {
      // Was selected the first item in list then delete metadata information
      ApiMetadata.remove(metadataId);
    }
  },
});
