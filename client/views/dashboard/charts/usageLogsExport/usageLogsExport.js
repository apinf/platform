Template.apiUsageLogs.events({
  'click #downloadUsageLogs': function (event, template) {

    var query = {
      index : "api-umbrella-logs-v1-" + moment().format("YYYY-MM"),
      type  : "log",
      limit : 10000
    };

    Meteor.call("getChartData", query, function (err, es) {

      if (err) throw err;

      var data = es.hits.hits;

      var usageData = [];

      data.forEach(function (record) {
        usageData.push(record._source);
      });

      console.log(usageData);

      var csv = Papa.unparse(usageData);

      // creates file object with content type of JSON
      var file = new Blob([csv], {type: "text/plain;charset=utf-8"});

      // forces "save As" function allow user download file
      saveAs(file, query.index + ".csv");

    });
  }
});
