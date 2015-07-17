ApiBackendConfigurations = new FS.Collection("apiBackendConfigurations", {
  // TODO: Determine how to upload files within the project directory without hardcoding FS path
  stores: [new FS.Store.FileSystem("apiBackendConfigurations", {path: "~/apiConfigurations"})]
});

if (Meteor.isServer) {
  ApiBackendConfigurations.allow({
    insert: function (userId, doc) {
      // allow insert by default
      // TODO: determine proper upload/insert permisison
      return true;
    },
    update: function (userId, doc) {
      return true;
    }
  });
}
