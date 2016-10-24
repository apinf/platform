import { Branding } from '/branding/collection';
import { Template } from 'meteor/templating';

Template.branding.onCreated(function () {
  const instance = this;
  // Subscription to branding collection
  instance.subscribe('branding');

  instance.subscribe('projectLogo');
});

Template.branding.onRendered(function () {
  // Attach color pickers to color fields
  $('[name="colors.primary"]').colorpicker();
  $('[name="colors.primaryText"]').colorpicker();
});

Template.branding.helpers({
  branding () {
    // Get Branding collection content
    return Branding.findOne();
  },
  brandingCollection () {
    return Branding;
  },
});
