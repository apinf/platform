// APINF imports
import emailSchema from './schema';

Template.apiUserAuthorizationForm.helpers({
  apiId () {
    // Get API ID
    const apiId = Template.instance().data.api._id;

    return apiId;
  },
  emailSchema () {
    return emailSchema;
  },
});

Template.apiUserAuthorizationForm.events({
  'submit #authorizedUserForm': function (event) {
    // Prevent form from reloading page
    event.preventDefault();
  },
});
