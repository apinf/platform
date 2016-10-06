import { emailSchema } from './schema';

Template.apiUserAuthorizationForm.helpers({
  emailSchema () {
    return emailSchema;
  }
});

Template.apiUserAuthorizationForm.events({
  'submit #authorizedUserForm' (event) {
    // Prevent form from reloading page
    event.preventDefault();
  }
});
