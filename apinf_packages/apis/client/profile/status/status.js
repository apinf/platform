/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// APInf import
import convertStatusCode from './convert_status_code';

Template.viewApiStatus.onRendered(() => {
  // Init tooltip
  $('[data-toggle="tooltip"]').tooltip();
});

Template.viewApiStatus.helpers({
  classList () {
    // Get api
    const api = Template.currentData().api;
    // Get class name depending on the api status code
    const { className } = convertStatusCode(api.latestMonitoringStatusCode);

    // Create a new line using join
    return [
      `api-status-indicator-${api._id}`,
      className,
    ].join(' ');
  },
  originalTitle () {
    // Get api
    const api = Template.currentData().api;

    // Get original title depending on the api status code
    const { statusText } = convertStatusCode(api.latestMonitoringStatusCode);

    return statusText;
  },
  statusIcon () {
    // Get api
    const api = Template.currentData().api;

    const { statusIcon } = convertStatusCode(api.latestMonitoringStatusCode);

    return statusIcon;
  },
});
