import { DocumentationFiles } from '/documentation/collection/collection';

Template.manageApiDocumentationModal.onCreated(function () {
  const instance = this;

  // Subscribe to documentation
  Meteor.subscribe('allDocumentationFiles');

  // Initialize help texts
  const helpTexts = {
    'documentation_link': {
      message: TAPi18n.__('editApi_hints_documentation_link'),
      options: {
        placement: 'left'
      }
    },
    'apiDocumentationEditor': {
      message: TAPi18n.__('editApi_hints_apiDocumentationEditor'),
      options: {
        placement: 'left'
      }
    },
    'importApiDocumentation': {
      message: TAPi18n.__('editApi_hints_importApiDocumentation'),
      options: {
        placement: 'left'
      }
    }
  };
  InlineHelp.initHelp(helpTexts);

  DocumentationFiles.resumable.on('fileAdded', function(file) {
    if(file && file.size <= 10485760) { // Limit file size to 10 MB
      Session.set(file.uniqueIdentifier, 0); //Init file progress
      return DocumentationFiles.insert({
        _id: file.uniqueIdentifier,
        filename: file.fileName,
        contentType: file.file.type
      }, function(err, documentationFile) {
        if (err) {
          sAlert.error("File creation failed!", err);
          console.warn("File creation failed!", err);
          return;
        }
        // Get the id from documentation file object
        const documentationFileId = documentationFile._str;

        // Update documenation file id field
        ApiBackends.update(instance.data.apiBackend._id, {$set: { documentationFileId }});

        // Hide modal
        Modal.hide('manageApiDocumentationModal');

        return DocumentationFiles.resumable.upload();
      });
    } else {
      // Inform user about file size Limit
      sAlert.warning("File size limit 10MB");
    }
  });
  DocumentationFiles.resumable.on('fileProgress', function(file) {
    return Session.set(file.uniqueIdentifier, Math.floor(100 * file.progress()));
  });
  DocumentationFiles.resumable.on('fileSuccess', function(file) {
    // Inform user about successful upload
    sAlert.success("File successfully uploaded!");

    return Session.set(file.uniqueIdentifier, void 0);
  });
  return DocumentationFiles.resumable.on('fileError', function(file) {
    console.warn("Error uploading", file.uniqueIdentifier);
    return Session.set(file.uniqueIdentifier, void 0);
  });
});

Template.manageApiDocumentationModal.onRendered(function() {
  // Assign resumable browse to element
  DocumentationFiles.resumable.assignBrowse($('.fileBrowse'));
});

Template.manageApiDocumentationModal.events({
  'click .del-file': function(event, instance) {
    if (Session.get("" + this._id)) {
      console.warn("Cancelling active upload to remove file! " + this._id);
      DocumentationFiles.resumable.removeFile(DocumentationFiles.resumable.getFromUniqueIdentifier("" + this._id));
    }
    // Get currentApiBackend documentationFileId
    const documentationFileId = this.apiBackend.documentationFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(documentationFileId);

    // Remove documentation object
    DocumentationFiles.remove(objectId);

    // Remove documenation file id field
    ApiBackends.update(instance.data.apiBackend._id, {$unset: { documentationFileId: "" }});

    // Hide modal
    Modal.hide('manageApiDocumentationModal');
  }
});


Template.manageApiDocumentationModal.helpers({
  fileName: function() {
    const currentDocumentationFileId = this.apiBackend.documentationFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentDocumentationFileId);
    const currentDocumentationFile = DocumentationFiles.findOne(objectId);

    return currentDocumentationFile.filename;
  },
  link: function() {
    return Meteor.absoluteUrl().slice(0, -1) + DocumentationFiles.baseURL + "/md5/" + this.md5;
  },
  uploadProgress: function() {
    var percent = Session.get("" + this._id);
    return percent || 0;
  },
  documentationExists: function () {
    const currentApiBackend = this.apiBackend;
    if (currentApiBackend.documentationFileId) {
      return true;
    }
  }
});
