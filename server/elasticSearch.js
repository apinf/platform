getMonthAnalytics = function (data) {

  var items = data.hits.hits;

  if(items){

    var datesArray = []; // long array that contains all the request dates

    // looping items, getting the date value from an item and pushing it to datesArray
    items.forEach(function (item) {
      var timeStamp = new Date(item._source.request_at);
      datesArray.push({
        "timeStamp": timeStamp.toString()
      });
    });


  }else {
    console.log("Data not found");
  }

  return datesArray;
};
