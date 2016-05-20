Template.chartsLayout.events({
  "change #filteringForm" : function(event, template){

    var instance = Template.instance();

    // appending loading state
    $('#loadingState').html("Loading...");

    event.preventDefault();

    var month = event.currentTarget.month.value;
    var year  = event.currentTarget.year.value;
    var limit = event.currentTarget.limit.value;

    var now = moment().format("YYYY-MM");

    now = now.split("-");

    if (year == 0000) year = now[0];
    if (month == 00) month = now[1];

    var input = {
      index : "api-umbrella-logs-v1-"+year+"-"+month,
      type  : "log",
      limit : limit,
      fields: [
        'request_at',
        'request_ip_country',
        'request_ip',
        'response_time',
        'request_path',
        'request_ip_location.lon',
        'request_ip_location.lat'
      ]
    };

    instance.getDashboardData(input)

  },
  "click #filter-reset": function(event, template){
    // Prevent default action; fix redirect in IE
    event.preventDefault();

    // appending loading state
    $('#loadingState').html("Loading...");

    // gets current month and year -> providing them for initial query
    var currentYearAndMonth = moment().format("YYYY-MM");

    // sets default items amount to be returned
    var initialLimit = 10000;

    // Initialize filter values
    $('#filter-month').val(undefined);
    $('#filter-year').val(undefined);
    $('#filter-limit').val( initialLimit.toString() );

    // sets query for elastic search
    var input = {
      index : "api-umbrella-logs-v1-"+currentYearAndMonth,
      type  : "log",
      limit : initialLimit,
      fields: [
        'request_at',
        'request_ip_country',
        'request_ip',
        'response_time',
        'request_path',
        'request_ip_location.lon',
        'request_ip_location.lat'
      ]
    };

    // get data
    template.getDashboardData(input);
  }
});
