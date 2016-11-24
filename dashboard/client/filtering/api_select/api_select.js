import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.apiSelectPicker.helpers({
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

Template.apiSelectPicker.events({
  'change #proxy-backend-select': function (event) {
    // Update selected backend URL parameter
    FlowRouter.setQueryParams({ backend: event.target.value });
  },
});
