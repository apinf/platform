import { Template } from 'meteor/templating';
import Branding from '/branding/collection';

Template.termsOfUse.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Subscription to branding collection
  instance.subscribe('branding');
});

Template.termsOfUse.helpers({
  branding () {
    // Get Branding collection content
    return Branding.findOne();
  },
});
