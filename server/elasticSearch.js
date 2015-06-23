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

  for (var i = 1; i <= 31; i++) {
    dates[i] = 0;
  }

  hits.forEach(function (e) {
    var stamp = new Date(e._source.request_at);
    var date = stamp.getDate();
    values.push(date);
  });

  values.forEach(function (j) {
    for (var k = 1; k <= 31; k++) {
      if (k == j) {
        dates[j]++;
      }
    }
  });

  //"dates" is an object that contains data to be used in chart

  var val = new ReactiveVar();
  val.set(dates);


}, function (err) {
  console.trace(err.message);
});

//here, for testing I am using reactive-var pakage to handle "dates" object, but it is not possible to fetch data from
//the function above.
console.log(val.get());
