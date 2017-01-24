import { Meteor } from 'meteor/meteor';
import { AutoForm } from 'meteor/aldeed:autoform';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';

AutoForm.hooks({
  organizationManagerForm: {
    onSubmit (submission) {
      // Get email address from form submission
      const email = submission.email;

      // Get reference to organization ID
      const organizationId = submission.organizationId;

      // Get reference to form, for use in method callback(s)
      const form = this;

      // Check if the email address is linked to a registered user
      Meteor.call('checkIfEmailIsRegistered', email, (error, emailIsRegistered) => {
        if (emailIsRegistered) {
          // Add user to managers list
          Meteor.call('addOrganizationManagerByEmail', organizationId, email, () => {
            if (!error) {
              // Continue with form submission
              form.done();
            }
          });
        } else {
          // Get 'email not registered' error message translation
          const message = TAPi18n.__('organizationManagerForm_emailNotRegistered_errorText');

          // Warn manager that user email is not registered
          sAlert.warning(message);

          // throw an error
          form.done(new Error('email-not-registered'));
        }
      });
    },
    onSuccess () {
      // Get success message translation
      const message = TAPi18n.__('organizationManagerForm_successMessage');

      // Alert user of success
      sAlert.success(message);
    },
    onError (error) {
      // Throw an error if one has been chatched
      return new Meteor.Error(error);
    },
  },
});
