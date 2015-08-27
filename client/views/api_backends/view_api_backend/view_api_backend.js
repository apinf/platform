Template.viewApiBackend.created = function() {
  // Create reference to instance
  var instance = this;

  // Get the API Backend ID from the route
  var backendId = Router.current().params.apiBackendId;

  // Subscribe to a single API Backend, by ID
  instance.subscribe("apiBackend", backendId);
};

Template.viewApiBackend.events({
  'click #exportJSONConfig' : function () {

    // fetches API object
    var apiBackend = ApiBackends.find().fetch();

    // converts JSON object to JSON string and adds indentation
    var jsonObj = JSON.stringify(apiBackend, null, '\t');

    // creates file object with content type of JSON
    var file = new Blob([jsonObj], {type: "application/json;charset=utf-8"});

    // forces "save As" function allow user download file
    saveAs(file, "apiConfig.json");
  },
  'click #exportYAMLConfig' : function () {

    // fetches API object
    var apiBackend = ApiBackends.find().fetch();

    // converts from json to yaml
    var yml = jsyaml.safeDump(apiBackend);

    // creates file object with content type of YAML
    var file = new Blob([yml], {type: "application/x-yaml;charset=utf-8"});

    // forces "save As" function allow user download file
    saveAs(file, "apiConfig.yaml");
  }
});
