AutoForm.addHooks(['apiDocumentationForm'], {
  onSuccess () {
    sAlert.success(TAPi18n.__('manageApiDocumentationModal_LinkField_Updated_Message'));
  },
});
