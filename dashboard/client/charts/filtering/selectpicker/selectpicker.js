import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import _ from 'lodash'

Template.apiSelectPicker.onRendered(function () {

  const instance = this;

  instance.selectPickerElement = $('#api-frontend-prefix');

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
        name: 'API Umbrella Logs',
        prefix: '/api-umbrella/'
      }
    }

    return {};
  }
});
