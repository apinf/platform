Meteor.methods({
  'convertYamlToJson': function(fileName){
    var fs = Npm.require('fs');
    var projectRoot = process.env.PWD;

    var item = ApiBackendConfigurations.findOne({ "original.name": fileName},{sort: {uploadedAt: -1}});


    var fileFullName = item.copies.apiBackendConfigurations.key;
    var path = projectRoot + "/uploads/apiBackendConfigs/" + fileFullName;

    var jsonFile;

    try {
      jsonFile = YAML.safeLoad(fs.readFileSync(path, 'utf8'));
    } catch (e) {
      console.log(e);
    }

    return jsonFile;
  }
});
