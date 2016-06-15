import { ApiLogos } from '/apis/logo/collection/collection';

Meteor.startup( function() {
  ApiLogos.resumable.on('fileAdded', function(file) {
    if(file && file.size <= 10485760) { // Limit file size to 10 MB
      return ApiLogos.insert({
        _id: file.uniqueIdentifier,
        filename: file.fileName,
        contentType: file.file.type
      }, function(err, apiLogosFile) {
        if (err) {
          console.warn("File creation failed!", err);
          return;
        }

        // Get the id from logo file object
        const apiLogosFileId = file.uniqueIdentifier;

        // Get apibackend id
        const apiBackend = Session.get('currentApiBackend');

        // Update logo id field
        ApiBackends.update(apiBackend._id, {$set: { apiLogosFileId }});

        sAlert.success('success! logo is uploaded');

        return ApiLogos.resumable.upload();

      });
    } else {
      // Inform user about file size Limit
      sAlert.warning('logo is too big');
    }
  });

});


Template.uploadLogo.onCreated(function() {
  const instance = this;
  // Subscribe to documentation
  instance.subscribe('allApiLogos');

  instance.autorun(function () {
    const apiBackend = ApiBackends.findOne(instance.data.apiBackend._id);
    // Save apibackend id
    Session.set('currentApiBackend', apiBackend);
  });
});

Template.uploadLogo.onRendered(function() {
  // Assign resumable browse to element
  ApiLogos.resumable.assignBrowse($('.fileBrowse'));
});

Template.uploadLogo.helpers({
  uploadedLogoLink: function() {

    const currentLogoFileId = this.apiBackend.apiLogosFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentLogoFileId);

    // Get documentation file Object
    const currentLogoFile = ApiLogos.findOne(objectId);

    // Check if documentation file is available
    if (currentLogoFile) {
      // Get documentation file URL
      return Meteor.absoluteUrl().slice(0, -1) + ApiLogos.baseURL + "/md5/" + currentLogoFile.md5;
    }
  }
});

