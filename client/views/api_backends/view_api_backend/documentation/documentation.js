Template.viewApiBackendDocumentation.onCreated(function(){
  // Init file uploader
  //Uploader.init(this);
});

Template.viewApiBackendDocumentation.events({
  'click #uploadSwaggerFile' : function (event, instance) {
    // Get API Backend from database collection
    var apiBackend = instance.data.apiBackend;

    // Upload Swagger file JSON/YAML

  }
});
