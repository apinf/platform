// Meteor packages imports
import { Template } from 'meteor/templating';

// APINF imports
import formatDate from '/core/helper_functions/format_date';

// Collection imports
import Organizations from '/organizations/collection';
import ApiMetadata from '../../collection';

Template.viewApiMetadata.onCreated(function () {
  // Get reference to template instance
  const instance = this;
  // Get id of API
  const apiId = instance.data.api._id;

  // Subscribe to metadata for this API Backend
  instance.subscribe('apiMetadata', apiId);

  // Subscribe to basic details of related api metadata
  instance.subscribe('apiOrganizationBasicDetails', apiId);
});

Template.viewApiMetadata.helpers({
  metadata () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get the API Backend ID from template instance
    const apiId = instance.data.api._id;

    // Get API Backend metadata
    const apiMetadata = ApiMetadata.findOne({ apiId });

    // Check apiMetadata is defined
    if (apiMetadata) {
      // Check service is defined
      if (apiMetadata.service) {
        const service = apiMetadata.service;
        // Format validSince if defined
        if (service.validSince) {
          service.validSince = formatDate(service.validSince);
        }
        // Format validUntil if defined
        if (service.validUntil) {
          service.validUntil = formatDate(service.validUntil);
        }
        // Attach formatted dates to metadata service object
        apiMetadata.service = service;
      }

      // Add info about organization

      const organization = Organizations.findOne(apiMetadata.organizationId);
      // Make sure migration was success and the related organisation document is found
      if (organization) {
        // Update old data to new one
        apiMetadata.organization = organization;
      }
    }

    return apiMetadata;
  },
});
