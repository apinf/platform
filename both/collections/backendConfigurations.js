ApiBackendConfigurations = new FS.Collection("apiBackendConfigurations", {
  stores: [new FS.Store.FileSystem("apiBackendConfigurations", {path: "~/apiConfigurations"})]
});
