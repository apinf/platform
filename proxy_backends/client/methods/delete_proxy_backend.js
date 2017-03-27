/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Function deletes proxy backend configuration from api Umbrella and Mongo DB
// Also shows sAlert
export default function deleteProxyBackendConfig (proxyBackend) {
  Meteor.call('deleteProxyBackend', proxyBackend, (error) => {
    if (error) {
      if (error.error === 'delete-error') {
        // Create & show message about delete error
        const deleteErrorMessage = `
        ${TAPi18n.__('proxyBackendForm_deleteErrorMessage')}:\n
        ${error.error}
        `;

        sAlert.error(deleteErrorMessage);
      } else if (error.error === 'publish-error') {
        // Create & show message about publish error
        const publishErrorMessage = `
        ${TAPi18n.__('proxyBackendForm_publishErrorMessage')}:\n
        ${error.error}
        `;
        sAlert.error(publishErrorMessage);
      }
    } else {
      // Show successMessage
      const successMessage = TAPi18n.__('proxyBackendForm_deleteSuccessMessage');
      sAlert.success(successMessage);
    }
  });
}
