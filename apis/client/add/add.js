// Meteor package import
import { Template } from 'meteor/templating';
// Import collections
import { Apis } from '../../collection';

Template.addApi.onCreated(function () {
  const instance = this;
  // subscribe to data
  instance.subscribe('allOrganizations');
});

Template.addApi.helpers({
  ApisCollection () {
    // Make APIs collection available to template (i.e. autoform)
    return Apis;
  },
});
