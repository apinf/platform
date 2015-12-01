Template.viewApiBackend.rendered = function () {

  // creates reference to "this"
  var instance = this;

  // sets up autorun for doing action once reactive var is changed
  instance.autorun(function () {

    // dashboard data from reactive variable
    var backendId = instance.backendId.get();

    // gets apiBackend by id
    var apiBackend = ApiBackends.findOne(backendId);

    // for testing console.log(apiBackend) can be called here to insure that apiBackend is up to date.

    // sets up request url based on protocol and host
    var url = apiBackend.backend_protocol + "://" + apiBackend.backend_host;

    // calls function that updates status
    instance.updateApiStatus(url);

  });

};


Template.viewApiBackend.created = function() {

  // Create reference to instance
  var instance = this;

  // Get the API Backend ID from the route
  instance.backendId = new ReactiveVar(Router.current().params._id);

  // Subscribe to a single API Backend, by ID
  instance.subscribe("apiBackend", instance.backendId.get());

  // attaches function to template instance to be able to call it in outside
  instance.updateApiStatus = function (url) {

    Meteor.call("getApiStatus", url, function (err, status) {

      // status object contents:
      // status = {
      //   isUp            : <boolean>,
      //   statusCode      : <integer>,
      //   responseContext : <object>,
      //   errorMessage    : <String>
      // };

      if (status.isUp) {

        // updates layout with success status
        $('#apiState').addClass('alert-success').html("API is operating normally.");

      }else{

        // initial error message
        var errorMessage = "API backend is down for some reason. Please contact support.";

        // updates layout with success status
        $('#apiState').addClass('alert-danger').html(errorMessage);

      }

      // showing when check did happen
      $('#whenUpdated').html("Just now");

    });

  }
};

Template.viewApiBackend.events({
  'click #exportJSONConfig' : function () {

    // Get API Backend ID from URL
    var apiBackendId = Router.current().params._id;

    // Get API Backend from database collection
    var apiBackend = ApiBackends.findOne(apiBackendId);

    // converts JSON object to JSON string and adds indentation
    var json = JSON.stringify(apiBackend, null, '\t');

    // creates file object with content type of JSON
    var file = new Blob([json], {type: "application/json;charset=utf-8"});

    // forces "save As" function allow user download file
    saveAs(file, "apiConfig.json");
  },
  'click #exportYAMLConfig' : function () {

    // Get API Backend ID from URL
    var apiBackendId = Router.current().params._id;

    // Get API Backend from database collection
    var apiBackend = ApiBackends.findOne(apiBackendId);

    // converts from json to yaml
    var yaml = jsyaml.safeDump(apiBackend);

    // creates file object with content type of YAML
    var file = new Blob([yaml], {type: "application/x-yaml;charset=utf-8"});

    // forces "save As" function allow user download file
    saveAs(file, "apiConfig.yaml");
  }
});
