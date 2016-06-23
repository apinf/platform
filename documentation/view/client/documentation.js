import { DocumentationFiles } from '/documentation/collection/collection';

Template.documentation.onCreated(function(){
  const instance = this;

  // Run subscription in autorun
  instance.autorun(() => {

    // Get current documentation file Id
    const documentationFileId = Template.currentData().apiBackend.documentationFileId;

    if (documentationFileId) {
      // Subscribe to documentation
      instance.subscribe('singleDocumentationFile', documentationFileId);
    }
  });
});

Template.documentation.onRendered(function () {
  $('[data-toggle="popover"]').popover();
});

Template.documentation.helpers({
  uploadedDocumentationLink: function() {

    const currentDocumentationFileId = this.apiBackend.documentationFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentDocumentationFileId);

    // Get documentation file Object
    const currentDocumentationFile = DocumentationFiles.findOne(objectId);

    // Check if documentation file is available
    if (currentDocumentationFile) {
      // Hash currentDocumentationFile
      const currentDocumentationFileHash = currentDocumentationFile.md5;

      // Get documentation file URL
      return Meteor.absoluteUrl().slice(0, -1) + DocumentationFiles.baseURL + "/md5/" + currentDocumentationFileHash;
    }
  },
  documentationLink: function() {
    // get documentation link
    const documentationLink = this.apiBackend.documentation_link;
    // check if exists
    if (documentationLink) {
      return documentationLink
    }
  },
  documentationExists: function () {
    const currentDocumentationFileId = this.apiBackend.documentationFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentDocumentationFileId);

    // Get documentation file Object
    const currentDocumentationFile = DocumentationFiles.findOne(objectId);

    // Check if documentation file is available
    if (currentDocumentationFile) {
      // Hash currentDocumentationFile
      const currentDocumentationFileHash = currentDocumentationFile.md5;

      // Get documentation file URL
      const docUrl = Meteor.absoluteUrl().slice(0, -1) + DocumentationFiles.baseURL + "/md5/" + currentDocumentationFileHash;
      // Check doc is served on docUrl, return true on success
      return doPoll(docUrl);
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

function doPoll(docUrl) {
  // Check doc is served on docUrl, return true on success
  let poll = $.get(docUrl, function() {
    return true;
  });
  // Callback on error
  poll.error(function(){
    console.log('Error, trying again in 5 seconds.');
    setTimeout(doPoll, 5000, docUrl);
  });
  if(poll) {
    return true;
  }
}
