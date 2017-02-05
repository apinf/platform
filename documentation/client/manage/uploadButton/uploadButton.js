import { Template } from 'meteor/templating';

import $ from 'jquery';

import { DocumentationFiles } from '/documentation/collection/collection';

Template.manageApiDocumentationModalUploadButton.onRendered(() => {
  // Assign resumable browse to element
  DocumentationFiles.resumable.assignBrowse($('#file-browse'));
});
