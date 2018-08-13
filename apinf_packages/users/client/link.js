
// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor packages import
import { Template } from 'meteor/templating';

// Npm packages imports
import _ from 'lodash';

Template.linkTemplate.events({
  'click .link-github': function () {
    Meteor.linkWithGithub();
  },
  'click .unlink-github': function () {
    Meteor.call('_accounts/unlink/service', Meteor.userId(), 'github');
  },
});

Template.linkTemplate.helpers({
  services: () => {
    const user = Meteor.user();
    if (user) {
      return _.keys(user.services);
    }
    return false;
  },
});
