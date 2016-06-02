import { DocumentationFiles } from '/documentation/collection/collection';

Template.documentation.onCreated(function(){
  const instance = this;

  // console.log(instance);
  // Subscribe to documentation
  Meteor.subscribe('allDocumentationFiles');
});

Template.documentation.helpers({
  link: function() {
    const currentDocumentationFileId = this.apiBackend.documentationFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentDocumentationFileId);

    // Get documentation file Object
    const currentDocumentationFile = DocumentationFiles.findOne(objectId);

    // Check if documentation file is available
    if (currentDocumentationFile) {
      // Get documentation file URL
      return Meteor.absoluteUrl().slice(0, -1) + DocumentationFiles.baseURL + "/md5/" + currentDocumentationFile.md5;
    }
  },
  documentationExists: function () {
    const currentApiBackend = this.apiBackend;
    if (currentApiBackend.documentationFileId) {
      return true;
    }
  }
});

Template.documentation.events({
  'click #manage-api-documentation' (event, instance) {
    // Get reference to API backend
    const apiBackend = instance.data.apiBackend
    // Show the manage API documentation form
    Modal.show('manageApiDocumentationModal', { apiBackend })
  }
});
