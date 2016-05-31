import { documentationFiles } from '/documentation/collection/collection';

Template.manageApiDocumentationModal.onCreated(function () {
  // Get current API Backend
  const currentApiBackend = this.data.apiBackend;

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

  documentationFiles.resumable.on('fileAdded', function(file) {
    if(file && file.size <= 10485760) { // Limit file size to 10 MB
      Session.set(file.uniqueIdentifier, 0); //Init file progress
      return documentationFiles.insert({
        _id: file.uniqueIdentifier,
        filename: file.fileName,
        contentType: file.file.type
      }, function(err, _id) {
        if (err) {
          console.warn("File creation failed!", err);
          return;
        }
        return documentationFiles.resumable.upload();
      });
    } else {
      // Inform user about file size Limit
      alert("File size limit 10MB");
    }
  });
  documentationFiles.resumable.on('fileProgress', function(file) {
    return Session.set(file.uniqueIdentifier, Math.floor(100 * file.progress()));
  });
  documentationFiles.resumable.on('fileSuccess', function(file) {
    alert("File successfully uploaded!");

    console.log(file);
    // TODO
    // 1. Get documentation file just added by Id?
    // 2. set documentationFileId for apiBackend

    return Session.set(file.uniqueIdentifier, void 0);
  });
  return documentationFiles.resumable.on('fileError', function(file) {
    console.warn("Error uploading", file.uniqueIdentifier);
    return Session.set(file.uniqueIdentifier, void 0);
  });
  // Subscribe to documentation
  Tracker.autorun(function() {
    Meteor.subscribe('allDocumentationFiles');
    //Meteor.subscribe('apiDocumentationFile');
  });

});

Template.manageApiDocumentationModal.onRendered(function() {
  // Assign resumable browse to element
  console.log(this.data.apiBackend);
  documentationFiles.resumable.assignBrowse($('.fileBrowse'));
});

Template.manageApiDocumentationModal.events({
  'click .del-file': function(e, t) {
    if (Session.get("" + this._id)) {
      console.warn("Cancelling active upload to remove file! " + this._id);
      documentationFiles.resumable.removeFile(documentationFiles.resumable.getFromUniqueIdentifier("" + this._id));
    }
    console.log("Deleting");
    console.log(this._id); // undefined

    // TODO
    // 1. Get currentApiBackend documentationFileId
    // 2. Remove documentationFile by MongoDB ObjectID

    return documentationFiles.remove({
      _id: this._id
    });
  }
});


Template.manageApiDocumentationModal.helpers({
  fileName: function() {
    return this.filename;
  },
  link: function() {
    return Meteor.absoluteUrl().slice(0, -1) + documentationFiles.baseURL + "/md5/" + this.md5;
  },
  uploadProgress: function() {
    var percent = Session.get("" + this._id);
    return percent || 0;
  },
});
