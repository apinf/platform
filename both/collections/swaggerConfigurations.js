SwaggerBackendConfigurations = new FS.Collection("swaggerBackendConfigurations", {
  // TODO: Determine how to upload files within the project directory without hardcoding FS path
  stores: [new FS.Store.FileSystem("swaggerBackendConfigurations", {path: "~/apinf/swaggerConfigurations"})],
  filter: {
    allow: {
      // ~ 10Mbs.
      maxSize: 10048567,
      extensions: ['json']
    }
  },
  onInvalid: function (message) {
    if (Meteor.isClient) {
      alert(message);
    } else {
      console.log(message);
    }
  }
});

if (Meteor.isServer) {
  SwaggerBackendConfigurations.allow({
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
