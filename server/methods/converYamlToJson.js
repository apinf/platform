Meteor.methods({
  'convertYamlToJson': function(fileName){
    var fs = Npm.require('fs');
    var projectRoot = process.env.PWD;

    var item = ApiBackendConfigurations.findOne({ "original.name": fileName},{sort: {uploadedAt: -1}});

    if (item) {
      var fileFullName = item.copies.apiBackendConfigurations.key;
      var path = projectRoot + "/uploads/apiBackendConfigs/" + fileFullName;

      var jsonFile;
      var apiOne;

      try {

        jsonFile = YAML.safeLoad(fs.readFileSync(path, 'utf8'));

        apiOne   = jsonFile.apis[0];

        jsonFile.apis.forEach(function (api) {
          ApiBackends.insert(api);
        });

      } catch (e) {
        console.log(e);
      }

      return apiOne;
    }else{
      return "Ooops";
    }
  }
});
