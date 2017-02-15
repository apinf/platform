// Meteor packages imports
import { Roles } from 'meteor/alanning:roles';
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import moment from 'moment';
import 'moment/min/locales.min';
import _ from 'lodash';

// Collection imports
import Organizations from './';

Organizations.helpers({
  currentUserCanManage () {
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
    // Get current language
    const language = TAPi18n.getLanguage();
    // Convert createdAt time to format "time ago"
    return moment(this.createdAt).locale(language).fromNow();
  },
});
