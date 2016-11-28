import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import $ from 'jquery';


Template.timeFrameSelectPicker.onRendered(function () {

  // Enable date picker on timeframe start
  $('#analytics-timeframe-start').datepicker({
    todayHighlight: true,
    endDate: 'today',
    autoclose: true,
  })
  // Save chosen date to URL parameter
  // in order to share dashboard state
  .on('changeDate', function (event) {
    // Set fromDate URL parameter to ISO YYYY-mm-dd
    FlowRouter.setQueryParams({ fromDate: event.format('yyyy-mm-dd') });
  });

  // Check URL parameters for 'from date' for analytics timeframe
  const fromDate = FlowRouter.getQueryParam('fromDate');

  // Set the start date based on URL parameters, if available
  if (fromDate) {
    $('#analytics-timeframe-start').datepicker('setDate', new Date(fromDate));
  }

  // Enable date picker on timeframe end
  $('#analytics-timeframe-end').datepicker({
    todayHighlight: true,
    endDate: 'today',
    autoclose: true,
  })
  // Save chosen date to URL parameter
  .on('changeDate', function (event) {
    // Set fromDate URL parameter to ISO YYYY-mm-dd
    // in order to share dashboard state
    FlowRouter.setQueryParams({ toDate: event.format('yyyy-mm-dd') });
  });

  // Check URL parameters for 'from date' for analytics timeframe
  const toDate = FlowRouter.getQueryParam('toDate');

  // Set the start date based on URL parameters, if available
  if (toDate) {
    $('#analytics-timeframe-end').datepicker('setDate', new Date(toDate));
  }
});
