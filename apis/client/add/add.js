// Meteor package import
import { Template } from 'meteor/templating';
// Import collections
import { Organizations } from '/organizations/collection';
import { Apis } from '../../collection';

Template.addApi.onCreated( function () {
  const instance = this;

  // Subscribe to all organizations, returns only id and name
  instance.subscribe('allOrganizationBasicDetails');
});

Template.addApi.helpers({
  ApisCollection () {
    // Make APIs collection available to template (i.e. autoform)
    return Apis;
  },
  organizationsExist () {
    const organizationsCount = Organizations.find().count();

    return organizationsCount > 0;
  },
});
