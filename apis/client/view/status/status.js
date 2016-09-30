// Meteor packages import
import { Template } from 'meteor/templating';

// APINF import
import { convertStatusCode } from '/apis/client/view/status/convert_status_code';

Template.viewApiStatus.onCreated(function () {
  // Create reference to instance
  const instance = this;

  // Get API Backend from instance data context
  const api = instance.data.api;

  // attaches function to template instance to be able to call it in outside
  instance.apiStatus = () => {
    // Recognize status code
    const status = convertStatusCode(api.status_code);

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

  // call the function that updates status
  instance.apiStatus();

  // Init tooltip
  $('[data-toggle="tooltip"]').tooltip();
});
