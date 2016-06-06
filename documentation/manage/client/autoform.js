AutoForm.addHooks(['apiBackendDocumentationLinkForm'], {
  onSuccess: function () {
    sAlert.success(TAPi18n.__('manageApiDocumentationModal_LinkField_Updated_Message'));
  }
});
