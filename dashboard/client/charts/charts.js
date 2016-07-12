import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import moment from 'moment';
import dc from 'dc';
import d3 from 'd3';
import crossfilter from 'crossfilter';

Template.dashboardCharts.onCreated(function () {

  const instance = this;

  // Variable that keeps table data
  instance.tableDataSet = new ReactiveVar([]);

  // Variable that keeps api frontend prefix list
  instance.apiFrontendPrefixList = new ReactiveVar();

  instance.requestsCount = new ReactiveVar(0);
  instance.avgResponseTime = new ReactiveVar(0);
  instance.avgResponseRate = new ReactiveVar(0);
  instance.uniqueUsersCount = new ReactiveVar(0);

  // Parse elasticsearch data into timescales, dimensions & groups for DC.js
  instance.parseChartData = function (items) {

    // Create crossfilter
    const index = new crossfilter(items);

    // Init dateformat for charts
    const dateFormat = d3.time.format("%Y-%m-%d-%H");

    // Create dimension based on a timestamp
    const timeStampDimension = index.dimension((d) => {

      let timeStamp = moment(d.fields.request_at[0]);

      // Format timestamp
      timeStamp = timeStamp.format('YYYY-MM-DD-HH');

      // Check if timestamp formats match
      d.fields.ymd = dateFormat.parse(timeStamp);

      return d.fields.ymd;
    });

    // Create timestamp group
    const timeStampGroup = timeStampDimension.group();

    // Create dimension based on status code
    const statusCodeDimension = index.dimension((d) => {

      const statusCode = d.fields.response_status[0];

      let statusCodeScope = '';

      // Init regEx for status codes
      const success = /^2[0-9][0-9]$/;
      const redirect = /^3[0-9][0-9]$/;
      const clientErr = /^4[0-9][0-9]$/;
      const serverErr = /^5[0-9][0-9]$/;

      // Find out in which scope status code is
      if (success.test(statusCode)) {
        statusCodeScope = '2XX';
      } else if (redirect.test(statusCode)) {
        statusCodeScope = '3XX';
      } else if (clientErr.test(statusCode)) {
        statusCodeScope = '4XX';
      } else if (serverErr.test(statusCode)) {
        statusCodeScope = '5XX';
      }

      return statusCodeScope;
    });

    const statusCodeGroup = statusCodeDimension.group(); // Create status code group

    const binwidth = 50; // Init binwidth for a bar chart

    // Get MIN and MAX response time values
    const minResponseTime = d3.min(items, function(d) { return d.fields.response_time[0]; });
    const maxResponseTime = d3.max(items, function(d) { return d.fields.response_time[0]; });

    // Create dimension based on response time
    const responseTimeDimension = index.dimension((d) => {
      return d.fields.response_time[0];
    });

    // Create response time group
    const responseTimeGroup = responseTimeDimension.group((d) => {
      return binwidth * Math.floor(d / binwidth);
    });

    // Group add dimensions
    const all = index.groupAll();

    // Keep data counters on a dashboard updated
    dc.dataCount("#row-selection")
      .dimension(index)
      .group(all);

    // Get MIN and MAX timestamp values
    const minDate = d3.min(items, function(d) { return d.fields.ymd; });
    const maxDate = d3.max(items, function(d) { return d.fields.ymd; });

    // Init scales for axis
    const timeScaleForLineChart = d3.time.scale().domain([minDate, maxDate]);
    const timeScaleForRangeChart = d3.time.scale().domain([minDate, maxDate]);
    const xScaleForBar = d3.scale.pow().domain([minResponseTime, 1000]);

    return {
      timeStampDimension,
      timeStampGroup,
      statusCodeDimension,
      statusCodeGroup,
      responseTimeDimension,
      responseTimeGroup,
      timeScaleForLineChart,
      timeScaleForRangeChart,
      xScaleForBar,
      binwidth
    };
  }

  // Render charts on the page
  instance.renderCharts = function (parsedData) {

    const {
      timeStampDimension,
      timeStampGroup,
      statusCodeDimension,
      statusCodeGroup,
      responseTimeDimension,
      responseTimeGroup,
      timeScaleForLineChart,
      timeScaleForRangeChart,
      xScaleForBar,
      binwidth
    } = parsedData;

    // Init charts
    const requestsOverTime = dc.lineChart('#requestsOverTime-chart');
    const overviewChart = dc.barChart('#overviewChart-chart');
    const statusCodeCounts = dc.rowChart('#statusCodeCounts-chart');
    const responseTimeDistribution = dc.barChart('#responseTimeDistribution-chart');

    requestsOverTime
      .height(350)
      .renderArea(true)
      .transitionDuration(300)
      .margins({top: 5, right: 20, bottom: 25, left: 40})
      .ordinalColors(['#2fa4e7'])
      .x(timeScaleForLineChart)
      .dimension(timeStampDimension)
      .group(timeStampGroup)
      .rangeChart(overviewChart)
      .brushOn(false)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      .elasticY(true);

    overviewChart
      .height(100)
      .dimension(timeStampDimension)
      .group(timeStampGroup)
      .xUnits(dc.units.fp.precision(binwidth))
      .centerBar(true)
      .gap(1)
      .margins({top: 5, right: 20, bottom: 25, left: 40})
      .ordinalColors(['#2fa4e7'])
      .x(timeScaleForRangeChart)
      .alwaysUseRounding(true)
      .elasticY(true)
      .yAxis().ticks(0);

    statusCodeCounts
      .height(215)
      .transitionDuration(300)
      .dimension(statusCodeDimension)
      .group(statusCodeGroup)
      .ordinalColors(['#28ae4f', '#ffc107', '#e15400', '#cc1410']) // Correspond to bootstrap color classes
      .elasticX(true)
      .xAxis().ticks(5);

    responseTimeDistribution
      .height(215)
      .transitionDuration(300)
      .dimension(responseTimeDimension)
      .group(responseTimeGroup)
      .centerBar(true)
      .xUnits(dc.units.fp.precision(binwidth))
      .margins({top: 5, right: 20, bottom: 25, left: 45})
      .ordinalColors(['#2fa4e7'])
      .brushOn(true)
      .x(xScaleForBar)
      .renderHorizontalGridLines(true)
      .xAxis().ticks(10);

    dc.renderAll(); // Render all charts

    // Iterate throuh each chart in a registry & set listeners for filtering
    _.forEach(dc.chartRegistry.list(), (chart) => {
      chart.on("filtered", () => {
        instance.updateDataTable(timeStampDimension);
        instance.updateLineChart(requestsOverTime, overviewChart, timeScaleForLineChart);
        instance.updateStatisticsData(timeStampDimension)
      });
    });

    instance.updateDataTable(timeStampDimension);
    instance.updateStatisticsData(timeStampDimension);
  }

  // Function that gets and parsed data for table
  instance.getTableData = function (timeStampDimension) {

    let tableDataSet = [];

    _.forEach(timeStampDimension.top(Infinity), (e) => {

      let time,
          country,
          requestPath,
          requestIp,
          responseTime;

      // Error handling for empty fields
      try { time = moment(e.fields.request_at[0]).format("D/MM/YYYY HH:mm:ss"); }
      catch (e) { time = ''; }

      try { country = e.fields.request_ip_country[0]; }
      catch (e) { country = ''; }

      try { requestPath = e.fields.request_path[0]; }
      catch (e) { requestPath = ''; }

      try { requestIp = e.fields.request_ip[0]; }
      catch (e) { requestIp = ''; }

      try { responseTime = e.fields.response_time[0]; }
      catch (e) { responseTime = ''; }

      tableDataSet.push({ time, country, requestPath, requestIp, responseTime });

    });

    return tableDataSet;
  }

  // Function that updates table data
  instance.updateDataTable = function (timeStampDimension) {
    const tableData = instance.getTableData(timeStampDimension);
    instance.tableDataSet.set(tableData);
  }

  // Function that updates time scale for line chart
  instance.updateLineChart = function (requestsOverTime, overviewChart, timeScaleForLineChart) {

    // Get current time range
    const selectedTimeRange = overviewChart.filter();

    // Check if filter was set
    if (selectedTimeRange) {
      requestsOverTime.x(d3.time.scale().domain(selectedTimeRange));
    } else {
      requestsOverTime.x(timeScaleForLineChart);
    }
  }

  // Function that fiters data based on frontend prefixes
  instance.filterData = function (items, apiFrontendPrefixList) {

    // Filter data based on matches with API frontend prefix
    return _.filter(items, (item) => {

      // Variable to hold request path
      const requestPath = item.fields.request_path[0];

      // Array to hold matched API frontend prefix
      const itemMatchingApiFrontendPrefix = _.filter(apiFrontendPrefixList, (apiFrontendPrefix) => {

        // Check if request path starts with API frontend prefix
        return requestPath.startsWith(apiFrontendPrefix);
      });

      // Check if API frontend prefix mathed the request path
      return itemMatchingApiFrontendPrefix.length;
    });
  }

  instance.updateStatisticsData = function (timeStampDimension) {

    // Get current data set from the dc registry
    const chartData = timeStampDimension.top(Infinity);

    // Get statistics sata
    const getRequestsCount = instance.getRequestsCount(chartData);
    const getAverageResponseTime = instance.getAverageResponseTime(chartData);
    const getAverageResponseRate = instance.getAverageResponseRate(chartData);
    const getUniqueUsersCount = instance.getUniqueUsersCount(chartData);

    // Set statistics data
    instance.requestsCount.set(getRequestsCount);
    instance.avgResponseTime.set(getAverageResponseTime);
    instance.avgResponseRate.set(getAverageResponseRate);
    instance.uniqueUsersCount.set(getUniqueUsersCount);
  }

  instance.getRequestsCount = function (chartData) {

    return chartData.length;
  }

  instance.getAverageResponseTime = function (chartData) {

    // Get average response time value
    const averageResponseTime = _.meanBy(chartData, (item) => { return item.fields.response_time[0]; });

    // Round it before return
    return _.round(averageResponseTime);
  }

  instance.getAverageResponseRate = function (chartData) {

    // Group chart data by response status code
    const responseStatusCodeGroup = _.groupBy(chartData, (item) => { return item.fields.response_status[0]; });

    // Calculate average response rate based on success (200) status code (persentage)
    const averageResponseRate = responseStatusCodeGroup['200'].length / chartData.length * 100;

    // Roound it before return
    return _.round(averageResponseRate);
  }

  instance.getUniqueUsersCount = function (chartData) {

    // Group unique users by user ID
    const uniqueUsersGroup = _.groupBy(chartData, (item) => {

      try {

        return item.fields.user_id[0];

      } catch (e) {

        return false;
      }
    });

    // Remove object key with no-user data
    delete uniqueUsersGroup['false'];

    // Return the amount of users in object
    return Object.keys(uniqueUsersGroup).length;
  }

});

Template.dashboardCharts.onRendered(function () {

  const instance = this;

  // Get reference to chart html elemets
  const chartElemets = $('#requestsOverTime-chart, #overviewChart-chart, #statusCodeCounts-chart, #responseTimeDistribution-chart');

  // Set loader
  chartElemets.addClass('loader');

  instance.autorun(() => {

    const chartData = Template.currentData().chartData;
    const apiFrontendPrefixList = instance.apiFrontendPrefixList.get();

    if (chartData) {

      let parsedData = [];

      if (apiFrontendPrefixList) {

        // Filter data by api frontend prefix
        const filteredData = instance.filterData(chartData, apiFrontendPrefixList);

        // Parse data for charts
        parsedData = instance.parseChartData(filteredData);

      } else {

        // Parse data for charts
        parsedData = instance.parseChartData(chartData);
      }

      // Render charts
      instance.renderCharts(parsedData);

      // Unset loader
      chartElemets.removeClass('loader');

    }
  });

  // Activate help icons
  $('[data-toggle="popover"]').popover();

});

Template.dashboardCharts.events({
  'change #api-frontend-prefix-form': function (event) {

    // Prevent default form submit
    event.preventDefault();

    // Get reference to template instance
    const instance = Template.instance();

    // Get selected value
    const apiFrontendPrefixList = $('#api-frontend-prefix').val();

    // Set reactive variable
    instance.apiFrontendPrefixList.set(apiFrontendPrefixList);
  }
});

Template.dashboardCharts.helpers({
  tableDataSet () {
    const instance = Template.instance();
    return instance.tableDataSet.get();
  },
  statisticsData () {

    const instance = Template.instance();

    return {
      requestsCount: instance.requestsCount.get(),
      avgResponseTime: instance.avgResponseTime.get(),
      avgResponseRate: instance.avgResponseRate.get(),
      uniqueUsersCount: instance.uniqueUsersCount.get()
    }
  }
});
