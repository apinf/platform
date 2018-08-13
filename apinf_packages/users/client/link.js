
// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor packages imports
import { Template } from 'meteor/templating';

  Template.linkTemplate.events({
    'click .link-github': function () {
      Meteor.linkWithGithub();
    },
    'click .unlink-github': function () {
      Meteor.call('_accounts/unlink/service', Meteor.userId(), 'github');
    }
  });

  Template.linkTemplate.helpers({
    services: function () {
      var user = Meteor.user();
      if (user) {
        return _.keys(user.services);
      } else {
        return;
      }
    }
  });
