// Meteor package import
import { Template } from 'meteor/templating';
// Import collections
import { Apis } from '../../collection';

Template.addApi.helpers({
  ApisCollection () {
    // Make APIs collection available to template (i.e. autoform)
    return Apis;
  },
});
