import { AutoForm } from 'meteor/aldeed:autoform';

AutoForm.hooks({
  authorizedUserForm: {
    onSubmit (submission) {
      // Get email address from form submission
      const email = submission.emailAddress;

      // Get reference to API ID
      const apiId = submission.apiId;

      // Get reference to form, for use in method callback(s)
      const form = this;

      // Check if the email address is linked to a registered user
      Meteor.call('checkIfEmailIsRegistered', email, function (error, emailIsRegistered) {
        if (emailIsRegistered) {
          console.log('email is registered')

          // Add user to API authorized users list
          Meteor.call('addAuthorizedUserByEmail', apiId, email, function (error, response) {
            if (!error) {
              // Continue with form submission
              form.done();
            }
          });
        } else {
          // throw an error
          form.done(new Error('email-not-registered'));
        }
      });
    },
    onSuccess () {
      console.log('success');
    },
    onError (error) {
      // do something with the error
    }
  },
});
