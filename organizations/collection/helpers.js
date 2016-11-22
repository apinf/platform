import { Meteor } from 'meteor/meteor';
import { Organizations } from './';

Organizations.helpers({
  currentUserCanEdit () {
    // Get current userId
    const userId = Meteor.userId();

    // Check if oranization was added by current user
    return this.createdBy === userId;
  },
});
