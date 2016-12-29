import { AutoForm } from 'meteor/aldeed:autoform';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';

AutoForm.hooks({
  organizationApisForm: {
    before: {
      insert (organizationApisDoc) {
        // Submit the form
        return organizationApisDoc;
      },
      update (organizationApisUpdateDoc) {
        // TODO: $push apiId to apiIds
        return organizationApisUpdateDoc;
      },
    },
    onSuccess () {
      // Create & show message on success
      const message = TAPi18n.__('organizationApisForm_successText');
      sAlert.success(message);
    },
  },
});
