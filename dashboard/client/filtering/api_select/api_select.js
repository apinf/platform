import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';

import $ from 'jquery';

Template.apiSelectPicker.onRendered(function () {
  const instance = this;

  instance.selectPickerElement = $('#frontend-prefix');

  // Initialize select picker widget
  instance.selectPickerElement.selectpicker({});
});

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
  'change #api-frontend-prefix': function (event, templateInstance) {
    console.log(event.target.value);
  }
});
