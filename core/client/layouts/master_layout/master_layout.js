import { Branding } from '/branding/collection';
import { Template } from 'meteor/templating';

Template.masterLayout.onCreated(function () {
  // Subscription to branding collection
  this.subscribe('branding');
  // Subscribe to project logo
  this.subscribe('projectLogo');
});

Template.masterLayout.helpers({
  branding () {
    // Return Branding document, or undefined
    return Branding.findOne();
  },
});
