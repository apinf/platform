import { Template } from 'meteor/templating';

Template.timeFrameSelectPicker.onRendered(function () {

  const instance = this;

  $('#analytics-timeframe-start').datepicker({
    todayHighlight: true,
    endDate: "today",
    autoclose: true,
  })
  .on('changeDate', function (event) {
    console.log(event.date.toISOString());
    // Set query parameter to value of search text
    UniUtils.url.setQuery('fromDate', event.date.toISOString());
  });

  $('#analytics-timeframe-stop').datepicker({
    todayHighlight: true,
    endDate: "today"
  });

})
