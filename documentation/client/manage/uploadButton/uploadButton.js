// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import DocumentationFiles from '/documentation/collection';

Template.manageApiDocumentationModalUploadButton.onRendered(() => {
  // Assign resumable browse to element
  DocumentationFiles.resumable.assignBrowse($('#file-browse'));
});
