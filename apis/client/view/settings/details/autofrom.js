// Meteor package import
import { AutoForm } from 'meteor/aldeed:autoform';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';

AutoForm.hooks({
  apiBackendForm: {
    onSuccess () {
      // Get old & new organization id
      const newOrganizationId = this.updateDoc.$set.organizationId || '';
      const oldOrganizationId = this.currentDoc.organizationId || '';

      // Create placeholder for message
      let message;

      // Was connected (or not) to organization and now user selected another one
      // Notify user about connecting current API to selected organization
      if (newOrganizationId && oldOrganizationId !== newOrganizationId) {
        message = TAPi18n.__('apiBackendForm_text_connectOrganization');
      } else {
        // User just updated API information
        message = TAPi18n.__('apiBackendForm_text_updateInformation');
      }
      // Show message
      sAlert.success(message);
    },
  },
})
