// Meteor packages import
import { Template } from 'meteor/templating';

// APINF import
import { convertStatusCode } from '/apis/client/view/status/convert_status_code';

Template.viewApiStatus.onCreated(function () {
  // Create reference to instance
  const instance = this;

  // attaches function to template instance to be able to call it in outside
  instance.apiStatus = (api) => {
    // Recognize status code
    const status = convertStatusCode(api.latestMonitoringStatusCode);

    // Get class name and status text for indicator
    const className = status.className;
    const statusText = status.statusText;

    // Init indicator element
    const apiStatusIndicator = $('.api-status-indicator-' + api._id);

    // Set indicator element
    apiStatusIndicator
      .addClass(className)
      .attr('data-original-title', statusText);
  };
});

Template.viewApiStatus.onRendered(function () {
  // Get reference to template instance
  const instance = this;

  const api = Template.currentData().api;

  // call the function that updates status
  instance.apiStatus(api);

  // Init tooltip
  $('[data-toggle="tooltip"]').tooltip();
});
