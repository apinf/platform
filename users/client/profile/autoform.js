// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

AutoForm.hooks({
  updateProfile: {
    onSuccess () {
      // Get update success message translation
      const message = TAPi18n.__('profile_updatedSuccess');

      // Alert user of success
      sAlert.success(message);
    },
    onError () {
      // TODO: find better way to handle username taken, and other errors
      // this.addStickyValidationError('username', 'usernameTaken');
    },
  },
});
