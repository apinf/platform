Template.importApiConfiguration.events({
  'change #apiCofigurationFile': function (event, template) {

    // Get the submitted file
    var file = event.target.files[0];

    // setting submitted file to a reactive variable, to have access to it from other helper within current template
    template.reactiveFile.set(file);

    // Insert into filesystem collection
    ApiBackendConfigurations.insert(file);

  },
  'submit #apiConfigurationUploadForm': function (event, template) {

    // calling method that converts YAML to JSON and returns Json object
    Meteor.call("convertYamlToJson", template.reactiveFile.get().name, function (err, jsonFile) {

      // logging an error if one exists
      if (err) console.log(err);

      // iterating through JSON object keys
      for (var key in jsonFile) {
        if (jsonFile.hasOwnProperty(key)) {

          // some fields in apiBackend schema not just strings, but arrays and objects, that is why there is a need tp
          // manually populate these fields

          // checking if key field contains object or an array, iterating through it manually as well as populating data
          switch (key){
            case "backend_protocol":

                      // backend_protocol is a select box, so there is a need to manually force it to select specific value
                      $("select[data-schema-key='"+key+"'] option[value='"+jsonFile[key]+"']").attr('selected', 'selected');
                  break;
            case "url_matches":

                    //  "url_matches" is an array object, so iterating through it
                    for(var i = 0; i<jsonFile[key].length; i++){

                      // updating filed value by data-schema-key attribute and its position in the array
                      $("input[data-schema-key='matching."+i+".frontend_prefix']").val(jsonFile[key][i].frontend_prefix);

                      // updating filed value by data-schema-key attribute and its position in the array
                      $("input[data-schema-key='matching."+i+".backend_prefix']").val(jsonFile[key][i].backend_prefix);
                    }
                  break;
            case "servers":

                    //  "servers" is an array object, so iterating through it
                    for(var i = 0; i<jsonFile[key].length; i++){

                      // updating filed value by data-schema-key attribute and its position in the array
                      $("input[data-schema-key='server."+i+".backend_host']").val(jsonFile[key][i].host);

                      // updating filed value by data-schema-key attribute and its position in the array
                      $("input[data-schema-key='server."+i+".backend_port']").val(jsonFile[key][i].port);
                    }
                  break;
            default :

                    // almost all other fields are regular text fields (strings)
                    // updating field value by just providing the field name
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

  // initializing a new reactive variable and "attaching" it to current template
  this.reactiveFile = new ReactiveVar();
};
