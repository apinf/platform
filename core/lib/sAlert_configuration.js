// Meteor packages imports
import { sAlert } from 'meteor/juliancwirko:s-alert';

Meteor.startup(() => {
  let config;
  if (Meteor.isClient) {
    config = sAlert.config({
      effect: 'stackslide',
      position: 'bottom-right',
      timeout: 3000,
      html: false,
    });
  }
  return config;
});
