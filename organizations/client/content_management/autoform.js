// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { FlowRouter } from 'meteor/kadira:flow-router';

AutoForm.hooks({
  numberOfMediasPerPageForm: {
    onSuccess () {
      // Get success message translation
      const message = TAPi18n.__('organizationSettingsContentManagement_successMessage');

      // Alert user of success
      sAlert.success(message);

      // Quick and dirty solution, to be fixed later
      // Because after updating URL, the oembed does not refresh
      // Using flow-router, a refresh is called
      const context = FlowRouter.current();
      FlowRouter.go('/');
      FlowRouter.go(context.path);
    },
  },
});
