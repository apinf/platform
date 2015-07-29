Template.chartsLayout.events({
  "change #filteringForm" : function(e){

    // appending loading state
    $('#loadingState').html("Loading...");

    console.log("Changed");

    e.preventDefault();

    var month = e.currentTarget.month.value;
    var year  = e.currentTarget.year.value;
    var limit = e.currentTarget.limit.value;

    var now = moment().format("YYYY-MM");

    now = now.split("-");

    if (year == 0000) year = now[0];
    if (month == 00) month = now[1];

    var input = {
      index : "api-umbrella-logs-v1-"+year+"-"+month,
      type  : "log",
      limit : limit,
      query : {
        match_all: {}
      },
      fields: [
        'request_at',
        'request_ip_country',
        'request_ip',
        'response_time',
        'request_path'
      ]
    };

    getData(input);

  }
});
