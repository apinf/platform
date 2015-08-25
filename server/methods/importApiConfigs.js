Meteor.methods({
  'importApiConfigs': function(jsonObj){

    // initial status obj
    var status = {
      isSuccessful: false,
      message: ""
    };

    // checks if file was passed
    if (jsonObj) {

      // parses json object
      var parsedJson = apiIsValid(jsonObj);

      // checks if valid
      if (parsedJson.isValid) {

        // additional error handling
        try{

          var newApiBackend = ApiBackends.insert(jsonObj);

          status.isSuccessful = true;
          status.message      = "API config has been successfully imported.";

          // gets new backend's id and passes it to client to be able to redirect then
          status.newBackendId  = newApiBackend;

        }catch(e){

          status.message = JSON.stringify(e);

        }

      }else{
        // if validation check failed - passing message returned by validation function
        status.message = parsedJson.message;
      }

      return status;

    }else{

      status.message = "Config is not found.";

      return status;
    }
  }
});

// validation function
function apiIsValid (jsonObj) {

  // initial status obj
  var status = {
    isValid : false,
    message : ""
  };

  // iterates through object keys and checks if required fields are provided
  // otherwise returns a message with missing field

  if (jsonObj.hasOwnProperty("_id")){

    status.message += "'_id' field is not allowed to import."

  }else{

    if (jsonObj.hasOwnProperty("name")){

      if (jsonObj.hasOwnProperty("backend_host")){

        if (jsonObj.hasOwnProperty("backend_protocol")){

          if (jsonObj.hasOwnProperty("frontend_host")){

            if (jsonObj.hasOwnProperty("balance_algorithm")){

              status.isValid = true;

              return status;

            }else{
              status.message += "'balance_algorithm'";
            }

          }else{
            status.message += "'frontend_host'";
          }

        }else{
          status.message += "'backend_protocol'";
        }

      }else{
        status.message += "'backend_host'";
      }

    }else{
      status.message += "'name'";
    }

    status.message += " field is required.";

  }


  return status;
}
