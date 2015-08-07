Template.importApiConfiguration.events({
  'change #apiCofigurationFile': function (event, template) {
    // Get the submitted file
    var file = event.target.files[0];

    template.reactiveFile.set(file);

    // Insert into filesystem collection
    var insertedFile = ApiBackendConfigurations.insert(file);
    console.log(insertedFile)

  },
  'submit #apiConfigurationUploadForm': function (event, template) {


    Meteor.call("convertYamlToJson", template.reactiveFile.get().name, function (err, jsonFile) {

      if (err) console.log(err);

      // iterating through JSON object keys
      for (var key in jsonFile) {
        if (jsonFile.hasOwnProperty(key)) {

          // checking if key field contains object or an array, iterating through it manually as well as populating data
          switch (key){
            case "backend_protocol":
                      $("select[data-schema-key='"+key+"'] option[value='"+jsonFile[key]+"']").attr('selected', 'selected');
                  break;
            case "url_matches":
                    for(var i = 0; i<jsonFile[key].length; i++){
                      $("input[data-schema-key='matching."+i+".frontend_prefix']").val(jsonFile[key][i].frontend_prefix);
                      $("input[data-schema-key='matching."+i+".backend_prefix']").val(jsonFile[key][i].backend_prefix);
                    }
                  break;
            case "servers":
                    for(var i = 0; i<jsonFile[key].length; i++){
                      $("input[data-schema-key='server."+i+".backend_host']").val(jsonFile[key][i].host);
                      $("input[data-schema-key='server."+i+".backend_port']").val(jsonFile[key][i].port);
                    }
                  break;
            default :
                    $("input[data-schema-key='"+key+"']").val(jsonFile[key]);
                  break;

          }
        }
      }
    });

    return false;
  }
});

Template.importApiConfiguration.created = function () {
  this.reactiveFile = new ReactiveVar();
};
