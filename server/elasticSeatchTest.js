ES.search({
  index: 'api-umbrella-logs-v1-2014-12',
  type: 'log',
  body: {
    query: {
      match_all: {}
    },
    size: 1000
  }
}).then(function (resp) {

  var hits = resp.hits.hits;
  var total = resp.hits.total;

  var values = [];
  var dates = {};

  for(var i=1;i<=31;i++){
    dates[i] = 0;
  }

  hits.forEach(function (e) {
    var stamp = new Date(e._source.request_at);
    var date = stamp.getDate();
    values.push(date);
  });

  values.forEach(function (j) {
    for(var k=1;k<=31;k++){
      if(k==j){
        dates[j]++;
      }
    }
  });

  console.log(dates);


}, function (err) {
  console.trace(err.message);
});
