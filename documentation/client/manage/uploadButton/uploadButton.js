import { DocumentationFiles } from '../../collection';

Template.manageApiDocumentationModalUploadButton.onRendered(function() {
  // Assign resumable browse to element
  DocumentationFiles.resumable.assignBrowse($('.fileBrowse'));
});
