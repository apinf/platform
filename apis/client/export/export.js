import jsyaml from 'js-yaml';

Template.viewApiBackendExport.events({
  'click #exportJSONConfig': function (event, instance) {
    // Get API Backend from database collection
    const api = instance.data.api;

    // converts JSON object to JSON string and adds indentation
    const json = JSON.stringify(api, null, '\t');

    // creates file object with content type of JSON
    const file = new Blob([json], { type: 'application/json;charset=utf-8' });

    // forces "save As" function allow user download file
    saveAs(file, 'apiConfig.json');
  },
  'click #exportYAMLConfig': function (event, instance) {
    // Get API Backend from database collection
    const api = instance.data.api;

    // converts from json to yaml
    const yaml = jsyaml.safeDump(api);

    // creates file object with content type of YAML
    const file = new Blob([yaml], { type: 'application/x-yaml;charset=utf-8' });

    // forces "save As" function allow user download file
    saveAs(file, 'apiConfig.yaml');
  },
});
