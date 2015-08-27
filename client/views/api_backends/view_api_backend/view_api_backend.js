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

    var apiBackend = ApiBackends.find().fetch();

    var jsonObj = JSON.stringify(apiBackend, null, '\t');

    var file = new Blob([jsonObj], {type: "application/json;charset=utf-8"});

    saveAs(file, "apiConfig.json");
  },
  'click #exportYAMLConfig' : function () {

    var apiBackend = ApiBackends.find().fetch();


    var yml = jsyaml.safeDump(apiBackend);

    var file = new Blob([yml], {type: "application/x-yaml;charset=utf-8"});

    saveAs(file, "apiConfig.yaml");
  }
});
