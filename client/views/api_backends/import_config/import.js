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
    Meteor.call("convertYamlToJson", template.reactiveFile.get().name, function (err, file) {

      if (err) console.log(err);

      for (var key in  file) {
        if (file.hasOwnProperty(key)) {

          switch (key){
            case "backend_protocol":
                      $("select[data-schema-key='"+key+"'] option[value='"+file[key]+"']").attr('selected', 'selected');
                  break;
            case "url_matches":
                    for(var i = 0; i<file[key].length; i++){
                      $("input[data-schema-key='matching."+i+".frontend_prefix']").val(file[key][i].frontend_prefix);
                      $("input[data-schema-key='matching."+i+".backend_prefix']").val(file[key][i].backend_prefix);
                    }
                  break;
            case "servers":
                    for(var i = 0; i<file[key].length; i++){
                      $("input[data-schema-key='server."+i+".backend_host']").val(file[key][i].host);
                      $("input[data-schema-key='server."+i+".backend_port']").val(file[key][i].port);
                    }
                  break;
            default :
                    $("input[data-schema-key='"+key+"']").val(file[key]);
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
