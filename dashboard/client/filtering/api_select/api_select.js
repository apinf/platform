import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.apiSelectPicker.helpers({
  // TODO: Update api Umbrella Admin case for multiple instance
  apiUmbrellaOption () {
    // Get current user Id
    const userId = Meteor.userId();
    // Check if current user has admin privileges
    if (Roles.userIsInRole(userId, ['admin'])) {
      return {
        name: 'Proxy Admin API',
        prefix: '/api-umbrella/',
      };
    }

    return {};
  },
});

// eslint-disable-next-line prefer-arrow-callback
Template.apiSelectPicker.onRendered(function () {
  // Get Proxy Backend ID parameter from URL,
  const proxyBackendId = FlowRouter.getQueryParam('backend');
  if (proxyBackendId) {
    // Update the select menu to match the Proxy Backend ID
    $('#proxy-backend-select').val(proxyBackendId);
  }
});

Template.apiSelectPicker.events({
  'change #proxy-backend-select': function (event) {
    // Update selected backend URL parameter
    FlowRouter.setQueryParams({ backend: event.target.value });
  },
});
