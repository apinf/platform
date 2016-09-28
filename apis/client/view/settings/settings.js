import { Template } from 'meteor/templating';
import { Apis } from '/apis/collection';

Template.apiSettings.events({
  // event handler to execute when delete API button is clicked
  'click #delete-api': function () {
    const api = this.api;
    /* As information to the delete modal, pass in the API backend document.
    This is needed so that the API name can be shown in the dialog,
    as well for other information needed for API removal, such as ID*/
    Modal.show('deleteApiConfirmation', { api });
  },
});

Template.apiSettings.helpers({
  formCollection () {
    return Apis;
  },
});
