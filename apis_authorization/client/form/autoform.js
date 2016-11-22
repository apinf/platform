import { AutoForm } from 'meteor/aldeed:autoform';
import { sAlert } from 'meteor/juliancwirko:s-alert';

AutoForm.hooks({
  authorizedUserForm: {
    onSubmit (submission) {
      // Get email address from form submission
      const email = submission.email;

      // Get reference to API ID
      const apiId = submission.apiId;

      // Get reference to form, for use in method callback(s)
      const form = this;

      // Check if the email address is linked to a registered user
      Meteor.call('checkIfEmailIsRegistered', email, function (error, emailIsRegistered) {
        if (emailIsRegistered) {
          // Add user to API authorized users list
          Meteor.call('addAuthorizedUserByEmail', apiId, email, function (error, result) {
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
      const message = TAPi18n.__('authorizedUserForm_success_message');

      // Alert user of success
      sAlert.success(message);
    },
    onError (error) {
      // do something with the error
      console.log(error);
    }
  },
});
