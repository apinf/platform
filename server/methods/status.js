Meteor.methods({
  'statusCheck' : function () {

    function checkApinf () {

      // initial status object
      var status = {
        operational : false,
        message     : ""
      };

      try{

        // initial host for apinf
        var apinfHost     = Meteor.settings.apinf.host;

        // response object from apinf GET request
        var apinfResponse = Meteor.http.call("GET", apinfHost);

        // checks is the status code matches 200
        if (apinfResponse.statusCode == 200) {

          // if status code is 200 changes operational state to TRUE and provides success message
          status.operational  = true;
          status.message      = "Apinf is operating normally.";
        }else{

          // if not, operational state remains false and provides different message
          status.message      = "Apinf is down for some reason. Please contact support.";
        }

      }catch(e){

        // if http call crashes, sending different message
        status.message = "Not able to access Apinf.";
      }

      return status;
    }

    function checkApiUmbrella () {

      // initial status object
      var status = {
        operational : false,
        message     : ""
      };

      try{

        // initial host for API umbrella
        var apiUmbrellaHost     = Meteor.settings.api_umbrella.base_url;

        // response object from API Umbrella GET request
        var apiUmbrellaResponse =  Meteor.http.call("GET", apiUmbrellaHost);

        // checks is the status code matches 200
        if (apiUmbrellaResponse.statusCode == 200) {

          // if status code is 200 changes operational state to TRUE and provides success message
          status.operational  = true;
          status.message      = "API Umbrella is operating normally.";
        }else{

          // if not, operational state remains false and provides different message
          status.message      = "API Umbrella is down for some reason. Please contact support.";
        }

      }catch(e){

        // if http call crashes, sending different message
        status.message = "Not able to reach API Umbrella.";

      }

      // if not, operational state remains false and provides different message
      return status;
    }

    function checkES () {

      // initial status object
      var status = {
        operational : false,
        message     : ""
      };

      try{
        // initial host for elasticsearch instance
        var elasticsearchInstance = Meteor.settings.elasticsearch.host;

        // response object from elasticsearch GET request
        var elasticsearchResponse =  Meteor.http.call("GET", elasticsearchInstance);

        // checks is the status code matches 200
        if (elasticsearchResponse.statusCode == 200) {

          // if status code is 200 changes operational state to TRUE and provides success message
          status.operational  = true;
          status.message      = "Elasticsearch is operating normally.";
        }else{

          // if not, operational state remains false and provides different message
          status.message      = "Elasticsearch is down for some reason. Please contact support.";
        }
      }catch(e){

        // if http call crashes, sending different message
        status.message = "Not able to reach Elasticsearch.";
      }

      // if not, operational state remains false and provides different message
      return status;
    }

    // statusCheck method returns object with statuses of all of the status checking functions written above
    return {
      apinf         : checkApinf(),
      elasticsearch : checkES(),
      apiUmbrella   : checkApiUmbrella()
    }
  }
});
