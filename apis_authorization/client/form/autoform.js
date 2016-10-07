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
          // Warn manager that user email is not registered
          sAlert.warning('Email address not currently registered.');

          // throw an error
          form.done(new Error('email-not-registered'));
        }
      });
    },
    onSuccess () {
      sAlert.success('Added user to Authorized Users list');
    },
    onError (error) {
      // do something with the error
    }
  },
});
