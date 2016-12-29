// Meteor package import
import { Template } from 'meteor/templating';
// Import collections
import { Apis } from '/apis/collection';

Template.apiSettingsDetails.helpers({
  apisCollection () {
    return Apis;
  },
});
