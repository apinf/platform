/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { TAPi18n } from 'meteor/tap:i18n';

// Check which status code is received
// and set class name and status text depending on it
export default function convertStatusCode (serverStatusCode) {
  // Init variables
  let className = '';
  let statusText = '';
  let statusIcon = '';

  // Computed an api status for Switch
  const apiStatus = Math.floor(serverStatusCode / 100);

  switch (apiStatus) {
    // Temporary status: monitoring is enabled but real status code is unknown
    case 0:
      className = 'status-wait';
      statusText = TAPi18n.__('viewApiStatus_statusMessage_Loading');
      break;
    // Informational status code
    case 1:
      className = 'status-info';
      statusText = `
          ${TAPi18n.__('viewApiStatus_statusMessage_ErrorCodeText')}
          ${serverStatusCode}.
          ${TAPi18n.__('viewApiStatus_statusMessage_Informational')}
          `;
      break;
    // Success status code
    case 2:
      className = 'status-success';
      statusText = TAPi18n.__('viewApiStatus_statusMessage_Success');
      statusIcon = 'mdi-checkbox-marked-circle';
      break;
    // Redirection code
    case 3:
      className = 'status-success';
      statusIcon = 'arrow-right-drop-circle';
      statusText = `
          ${TAPi18n.__('viewApiStatus_statusMessage_ErrorCodeText')}
          ${serverStatusCode}.
          ${TAPi18n.__('viewApiStatus_statusMessage_RedirectError')}
          `;
      break;
    // Client Error code
    case 4:
      className = 'status-warning';
      statusIcon = 'mdi-alert-circle';
      statusText = `
          ${TAPi18n.__('viewApiStatus_statusMessage_ErrorCodeText')}
          ${serverStatusCode}.
          ${TAPi18n.__('viewApiStatus_statusMessage_ClientError')}
          `;
      break;
    // Server Error code
    case 5:
      className = 'status-danger';
      statusIcon = 'mdi-close-circle';
      statusText = `
          ${TAPi18n.__('viewApiStatus_statusMessage_ErrorCodeText')}
          ${serverStatusCode}.
          ${TAPi18n.__('viewApiStatus_statusMessage_ServerError')}
          `;
      break;
    // The api monitoring is disable
    default:
      className = 'invisible';
      break;
  }

  return { className, statusText, statusIcon };
}
