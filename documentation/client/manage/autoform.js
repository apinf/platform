AutoForm.hooks({
  apiDocumentationForm: {
    onSuccess () {
      // Get success message translation
      const message = TAPi18n.__('manageApiDocumentationModal_LinkField_Updated_Message');

      // Alert user of success
      sAlert.success(message);
    },
  },
});
