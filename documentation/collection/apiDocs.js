ApiDocs = new Mongo.Collection('apiDocs');

ApiDocs.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});

ApiDocs.helpers({
  getApiBackendName: function () {
    // Get API Backend ID
    var apiBackendId = this.apiBackendId;

    // Get API Backend
    var apiBackend = ApiBackends.findOne(apiBackendId);

    // Get API Backend name
    var apiBackendName = apiBackend.name;

    return apiBackendName;
  }
});
