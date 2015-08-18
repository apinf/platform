Meteor.methods({
  'convertYamlToJson': function(fileId){
    //var fs = Npm.require('fs');

    var item = ApiBackendConfigurations.findOne(fileId);

    if (item) {

      var Id = item.copies.apiConfigs.key;

      console.log(Id)

      //var file = configFiles.findOne({ "files_id['_str']": Id });

      //console.log(file)

      //var path = "/uploads/apiBackendConfigs/" + fileFullName;
      //
      //var jsonFile;
      //
      //try {
      //  jsonFile = YAML.safeLoad(fs.readFileSync(path, 'utf8'));
      //
      //  jsonFile.apis.forEach(function (api) {
      //    ApiBackends.insert(api);
      //  });
      //
      //} catch (e) {
      //  console.log(e);
      //}

      return "Done";
    }else{
      return "Ooops";
    }
  }
});
