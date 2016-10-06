import { emailSchema } from './schema';

Template.apiUserAuthorizationForm.helpers({
  emailSchema () {
    return emailSchema;
  }
});
