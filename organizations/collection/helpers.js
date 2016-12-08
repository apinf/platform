import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import moment from 'moment';
import _ from 'lodash';

import { Organizations } from './';

Organizations.helpers({
  currentUserCanEdit () {
    // Get current userId
    const userId = Meteor.userId();

    // Check that user is logged in
    if (userId) {
      // Check if user is manager of this organization
      const userIsManager = _.includes(this.managerIds, userId);

      // Check if user is administrator
      const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

      // if user is manager or administrator, they can edit
      return userIsManager || userIsAdmin;
    }
    // User is not logged in
    return false;
  },
  relativeCreatedAt () {
    // Convert createdAt time to format "time ago"
    return moment(this.createdAt).fromNow();
  },
});
