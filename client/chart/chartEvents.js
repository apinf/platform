Template.filtering.events({
  "change #filteringForm" : function(e){

    // appending loading state
    $('#loadingState').html("Loading...");

    console.log("Changed");

    e.preventDefault();

    var month = e.currentTarget.month.value;
    var year  = e.currentTarget.year.value;
    var limit = e.currentTarget.limit.value;

    var input = {
      index : "api-umbrella-logs-v1-"+year+"-"+month,
      type  : "log",
      limit : limit,
      query : {
        match_all: {}
      }
    };


    drawChart(input);
  }
});
