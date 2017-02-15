// Meteor packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Npm packages imports
import _ from 'lodash';

Template.apiAuthorizedUsersList.helpers({
  authorizedUsers () {
    // Get API document, reactively
    const api = Template.currentData().api;

    // Get all authorized users for current API
    let authorizedUsers = Meteor.users.find({
      _id: { $in: api.authorizedUserIds },
    }).fetch();

    // flatten structure of users within authorized users array
    authorizedUsers = _.map(authorizedUsers, (user) => {
      return {
        username: user.username,
        email: user.emails[0].address,
        _id: user._id,
      };
    });

    return authorizedUsers;
  },
});

Template.apiAuthorizedUsersList.events({
  'click .remove-authorized-user': function (event, templateInstance) {
    // Get API object from parent templateInstance
    const api = templateInstance.data.api;

    // Get user document from instance data context
    const user = this;

    // Show the confirmation dialogue, passing in user document
    Modal.show('apiRemoveAuthorizedUser', { user, api });
  },
});
