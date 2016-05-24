import jsyaml from 'js-yaml';

Template.viewApiBackendExport.events({
  'click #exportJSONConfig' : function (event, instance) {
    // Get API Backend from database collection
    var apiBackend = instance.data.apiBackend;

    // converts JSON object to JSON string and adds indentation
    var json = JSON.stringify(apiBackend, null, '\t');

    // creates file object with content type of JSON
    var file = new Blob([json], {type: "application/json;charset=utf-8"});

    // forces "save As" function allow user download file
    saveAs(file, "apiConfig.json");
  },
  'click #exportYAMLConfig' : function (event, instance) {
    // Get API Backend from database collection
    var apiBackend = instance.data.apiBackend;

    // converts from json to yaml
    var yaml = jsyaml.safeDump(apiBackend);

    // creates file object with content type of YAML
    var file = new Blob([yaml], {type: "application/x-yaml;charset=utf-8"});

    // forces "save As" function allow user download file
    saveAs(file, "apiConfig.yaml");
  }
});
