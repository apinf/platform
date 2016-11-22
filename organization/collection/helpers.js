import { Meteor } from 'meteor/meteor';
import { Organizations } from './';

Organizations.helpers({
  currentUserCanEdit () {
    // Get current userId
    const userId = Meteor.userId();

    // Check if oranization
    if (this.createdBy === userId) {
      return true;
    }

    return false;
  },
});
