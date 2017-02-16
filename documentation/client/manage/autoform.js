import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import Apis from '/apis/collection';

AutoForm.hooks({
  apiDocumentationForm: {
    onSuccess () {
      const api = Apis.findOne();

      // Checks if user selected option but submitted without content
      if (api.documentationType === 'url' && !api.documentationUrl) {
        Apis.update(api._id, { $set: { documentationType: 'file' } });
      } else if (api.documentationType === 'file' && !api.documentationFileId) {
        Apis.update(api._id, { $set: { documentationType: 'url' } });
      }
      // Get success message translation
      const message = TAPi18n.__('manageApiDocumentationModal_LinkField_Updated_Message');

      // Alert user of success
      sAlert.success(message);
    },
  },
});
