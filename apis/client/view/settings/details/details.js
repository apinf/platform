// Meteor package import
import { Template } from 'meteor/templating';
// Import collections
import { Apis } from '/apis/collection';

Template.apiSettings_details.onCreated(function () {
  const instance = this;
  // subscribe to data
  instance.subscribe('allOrganizations');
});

Template.apiSettings_details.helpers({
  apisCollection () {
    return Apis;
  },
});
