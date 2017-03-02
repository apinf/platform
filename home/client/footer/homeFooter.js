// Meteor packages imports
import { Template } from 'meteor/templating';

Template.homeFooter.helpers({
  socialMediaIcon (networkName) {
    // Return networkName as lowercase string
    return networkName.toLowerCase();
  },
});
