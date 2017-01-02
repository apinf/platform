import { Organizations } from '/organizations/collection';
import { ApiMetadata } from '/metadata/collection';

export function updateOrganizationMetadata (organizationId, apiId) {
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
  }
}
