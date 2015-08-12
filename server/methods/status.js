Meteor.methods({
  'statusCheck' : function () {

    function checkApinf () {

      var status = {
        operational : false,
        message     : ""
      };

      var apinfHost     = "https://apinf.com";
      var apinfResponse = Meteor.http.call("GET", apinfHost);

      if (apinfResponse.statusCode == 200) {
        status.operational  = true;
        status.message      = "Apinf is operating normally.";
      }else{
        status.message      = "Apinf is down for some reason. Please contact support.";
      }

      return status;
    }

    function checkApiUmbrella () {

      var status = {
        operational : false,
        message     : ""
      };

      var apiUmbrellaHost       = "https://umbrella.apinf.io/";
      var apiUmbrellaResponse =  Meteor.http.call("GET", apiUmbrellaHost);


      if (apiUmbrellaResponse.statusCode == 200) {
        status.operational  = true;
        status.message      = "API Umbrella is operating normally.";
      }else{
        status.message      = "API Umbrella is down for some reason. Please contact support.";
      }

      return status;
    }

    function checkES () {

      var status = {
        operational : false,
        message     : ""
      };

      var elasticsearchInstance = "http://apinf.com:14002/";

      var elasticsearchResponse =  Meteor.http.call("GET", elasticsearchInstance);

      if (elasticsearchResponse.statusCode == 200) {
        status.operational  = true;
        status.message      = "Elasticsearch is operating normally.";
      }else{
        status.message      = "Elasticsearch is down for some reason. Please contact support.";
      }

      return status;
    }

    return {
      apinf         : checkApinf(),
      elasticsearch : checkES(),
      apiUmbrella   : checkApiUmbrella()
    }
  }
});
