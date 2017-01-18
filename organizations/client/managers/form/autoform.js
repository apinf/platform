import { AutoForm } from 'meteor/aldeed:autoform';
import { sAlert } from 'meteor/juliancwirko:s-alert';

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
      Meteor.call('checkIfEmailIsRegistered', email, function (error, emailIsRegistered) {
        if (emailIsRegistered) {
          // Add user to managers list
          Meteor.call('addOrganizationManagerByEmail', organizationId, email, function (error, result) {
            if (!error) {
              // Continue with form submission
              form.done();
            }
          });
        } else {
          // Get 'email not registered' error message translation
          const message = TAPi18n.__('authorizedUserForm_emailNotRegistered_errorText');

          // Warn manager that user email is not registered
          sAlert.warning(message);

          // throw an error
          form.done(new Error('email-not-registered'));
        }
      });
    },
    onSuccess () {
      // Get success message translation
      const message = "New manager added";

      // Alert user of success
      sAlert.success(message);
    },
    onError (error) {
      // do something with the error
      console.log(error);
    }
  },
});
