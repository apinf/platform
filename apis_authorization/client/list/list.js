import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'lodash';

Template.apiAuthorizedUsersList.helpers({
  authorizedUsers () {
    // Get API document, reactively
    const api = Template.currentData().api;

    // Get all authorized users for current API
    let authorizedUsers = Meteor.users.find({
      _id: { $in: api.authorizedUserIds },
    }).fetch();

    // flatten structure of users within authorized users array
    authorizedUsers = _.map(authorizedUsers, function (user) {
      return {
        username: user.username,
        email: user.emails[0].address,
      };
    });

    return authorizedUsers;
  },
});

Template.apiAuthorizedUsersList.events({
  'click .remove-authorized-user': function () {
    // Get user document from instance data context
    const user = this;

    // Show the confirmation dialogue, passing in user document
    Modal.show('apiRemoveAuthorizedUser', { user });
  }
});
