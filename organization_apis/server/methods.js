import { Meteor } from 'meteor/meteor';
import { ApiMetadata } from '/metadata/collection';
import { OrganizationApis } from '../collection';
import { updateOrganizationMetadata } from './update_metadata';

Meteor.methods({
  connectOrganizationApi (doc) {
    const organizationId = doc.organizationId;
    const apiId = doc.apiIds[0];
    const organizationApisDoc = OrganizationApis.findOne({ organizationId });

    if (organizationApisDoc) {
      OrganizationApis.update({ organizationId }, { $push: { apiIds: apiId } }, {}, (error, numberOfDocs) => {
        if (error) {
          throw new Meteor.Error('Update error');
        }
        updateOrganizationMetadata(organizationId, apiId);
      });
    } else {
      OrganizationApis.insert(doc, (error, id) => {
        if (error) {
          throw new Meteor.Error('Insert error');
        }
        updateOrganizationMetadata(organizationId, apiId);
      });
    }
  },
  disconnectOrganizationApi (organizationId, apiId) {
    OrganizationApis.update({ organizationId }, { $pull: { apiIds: apiId } }, {}, (error, numberOfDocs) => {
      if (error) {
        throw new Meteor.Error('Update error');
      }
      // Try to find metadata document of current API
      const metadata = ApiMetadata.findOne({ apiBackendId: apiId });
      // Get metadata id otherwise it will be empty string
      const metadataId = metadata ? metadata._id : '';
      ApiMetadata.remove(metadataId);
    });
  },
});
