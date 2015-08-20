Meteor.methods({
  'importApiConfigs': function(jsonObj){

    var status = {
      isSuccessful: false,
      message: ""
    };

    if (jsonObj) {

      // parse json object

      var parsedJson = apiIsValid(jsonObj);

      if (parsedJson.isValid) {

        try{

          ApiBackends.insert(jsonObj);

          status.isSuccessful = true;
          status.message      = "API config has been successfully imported."

        }catch(e){

          status.message = JSON.stringify(e);

        }

      }else{
        status.message = parsedJson.message;
      }

      return status;

    }else{

      status.message = "Config is not found.";

      return status;
    }
  }
});

function apiIsValid (jsonObj) {

  var status = {
    isValid : false,
    message : ""
  };

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
