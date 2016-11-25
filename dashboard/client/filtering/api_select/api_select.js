import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { UniUtils } from 'meteor/universe:reactive-queries';

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

Template.apiSelectPicker.events({
  'change #proxy-backend-select': function (event) {
    // Get value of
    const backend = event.target.value;

    // Update selected backend URL parameter
    UniUtils.url.setQuery('backend', backend);
  },
});
