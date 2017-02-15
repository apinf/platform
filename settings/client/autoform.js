// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

AutoForm.hooks({
  settings: {
    onSuccess () {
      // Call for configuration updates
      Meteor.call('updateGithubConfiguration');
      Meteor.call('configureSmtpSettings');

      // Get settings form success message translation
      const message = TAPi18n.__('settings_successMessage');

      // Alert the user of successful save
      sAlert.success(message);
    },
  },
});
