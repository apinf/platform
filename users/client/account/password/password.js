import { UpdatePasswordSchema } from './schema';

Template.updatePassword.helpers({
  updatePasswordSchema () {
    // Return a reference to the updatePasswordSchema
    return UpdatePasswordSchema;
  }
});
