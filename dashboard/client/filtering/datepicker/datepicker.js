import { Template } from 'meteor/templating';

Template.timeFrameSelectPicker.onRendered(function () {

  const instance = this;

  // Enable date picker on timeframe end
  $('#analytics-timeframe-start').datepicker({
    todayHighlight: true,
    endDate: "today",
    autoclose: true,
  })
  // Save chosen date to URL parameter
  .on('changeDate', function (event) {
    // Set fromDate URL parameter to ISO YYYY-mm-dd
    // in order to share dashboard state
    UniUtils.url.setQuery('fromDate', event.date.toISOString().substring(0, 10));
  });

  // Enable date picker on timeframe end
  $('#analytics-timeframe-end').datepicker({
    todayHighlight: true,
    endDate: "today"
  })
  // Save chosen date to URL parameter
  .on('changeDate', function (event) {
    // Set fromDate URL parameter to ISO YYYY-mm-dd
    // in order to share dashboard state
    UniUtils.url.setQuery('toDate', event.date.toISOString().substring(0, 10));
  });

});
