import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { Organizations } from './';

Organizations.helpers({
  currentUserCanEdit () {
    // Get current userId
    const userId = Meteor.userId();

    // Check if oranization was added by current user
    return this.createdBy === userId;
  },
  relativeCreatedAt () {
    // Return relative updated_at
    return moment(this.createdAt).fromNow();
  },
});
