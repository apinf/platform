Template.viewApiBackend.created = function() {

  // Create reference to instance
  var instance = this;

  // Get the API Backend ID from the route
  var backendId = Router.current().params.apiBackendId;

  // Subscribe to a single API Backend, by ID
  instance.subscribe("apiBackend", backendId);
};

Template.viewApiBackend.rendered = function () {

  // fetches current apiBackend
  var apiBackend = ApiBackends.findOne();

  // sets up request url based on protocol and host
  var url = apiBackend.backend_protocol + "://" + apiBackend.backend_host;

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

};

Template.viewApiBackend.events({
  'click #exportJSONConfig' : function () {

    // fetches API object
    var apiBackend = ApiBackends.findOne(Router.current().params._id);

    // converts JSON object to JSON string and adds indentation
    var jsonObj = JSON.stringify(apiBackend, null, '\t');

    // creates file object with content type of JSON
    var file = new Blob([jsonObj], {type: "application/json;charset=utf-8"});

    // forces "save As" function allow user download file
    saveAs(file, "apiConfig.json");
  },
  'click #exportYAMLConfig' : function () {

    // fetches API object
    var apiBackend = ApiBackends.findOne(Router.current().params._id);

    // converts from json to yaml
    var yml = jsyaml.safeDump(apiBackend);

    // creates file object with content type of YAML
    var file = new Blob([yml], {type: "application/x-yaml;charset=utf-8"});

    // forces "save As" function allow user download file
    saveAs(file, "apiConfig.yaml");
  }
});


