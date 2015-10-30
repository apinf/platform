/*jshint -W020 */
ApiDocumentation = new FS.Collection("apiDocumentation", {
  // TODO: Determine how to upload files within the project directory
  // without hardcoding FS path
  stores: [
    new FS.Store.GridFS("apiDocumentation")
 ],
});

ApiDocumentation.filters({
  allow: {
    // ~ 10Mbs.
    maxSize: 10048567,
    extensions: ['json', 'yaml', 'txt', 'swagger']
  },
  onInvalid: function (message) {
    // Show error message if it doesn't pass filter settings
    FlashMessages.sendError(message);
  }
});

if (Meteor.isServer) {
  ApiDocumentation.allow({
    insert: function (/*userId, doc*/) {
      // allow insert by default
      // TODO: determine proper upload/insert permisison
      return true;
    },
    update: function (/*userId, doc*/) {
      return true;
    },
    download: function(/*userId, fileObj*/) {
      return true;
    }
  });
}
