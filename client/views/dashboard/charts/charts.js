import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import _ from 'lodash';
import moment from 'moment';
import dc from 'dc';
import d3 from 'd3';
import crossfilter from 'crossfilter';

Template.chartsLayout.onCreated(function () {

  const instance = this;

  instance.esData = new ReactiveVar(); // Handles ES data for charts
  instance.tableDataSet = new ReactiveVar([]); // Handles parsed data for charts

  instance.timeStart = new Date().getTime(); // Timer

  const params = {
    size: 50000,
    body: {
      query: {
        filtered: {
          query: {
            match_all: {}
          },
          filter: {
            range: {
              request_at: {
                gte: moment().subtract(30, 'day').valueOf()
              }
            }
          }
        }
      },
      sort : [
          { request_at : { order : 'desc' }},
      ],
      fields: [
        'request_at',
        'response_status',
        'response_time',
        'request_ip_country',
        'request_ip',
        'request_path'
      ]
    }
  }

  Meteor.call('getElasticSearchData', params, (err, res) => {

    if (err) throw new Meteor.error(err);

    console.log('Got result!');
    console.log('Took ' + (new Date().getTime() - instance.timeStart) / 1000 + ' seconds.');

    const hits = res.hits.hits; // Get list of items for analytics

    instance.esData.set(hits); // Update reactive variable
  });

  instance.parseChartData = function (items) {

    const index = new crossfilter(items); // Create crossfilter

    const dateFormat = d3.time.format("%Y-%m-%d-%H"); // Init dateformat for charts

    // Create dimension based on a timestamp
    const timeStampDimension = index.dimension((d) => {

      let timeStamp = moment(d.fields.request_at[0]);

      timeStamp = timeStamp.format('YYYY-MM-DD-HH'); // Format timestamp

      d.fields.ymd = dateFormat.parse(timeStamp); // Check if timestamp formats match

      return d.fields.ymd;
    });

    const timeStampGroup = timeStampDimension.group(); // Create timestamp group

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

    const binwidth = 100; // Init binwidth for a bar chart

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

    const all = index.groupAll(); // Group add dimensions

    // Keep data counters on a dashboard updated
    dc.dataCount("#row-selection")
      .dimension(index)
      .group(all);

    // Get MIN and MAX timestamp values
    const minDate = d3.min(items, function(d) { return d.fields.ymd; });
    const maxDate = d3.max(items, function(d) { return d.fields.ymd; });

    // Init scales for axis
    const timeScaleForLine = d3.time.scale().domain([minDate, maxDate]);
    const timeScaleForFocus = d3.time.scale().domain([minDate, maxDate]);
    const xScaleForBar = d3.scale.pow().domain([minResponseTime, 1000]);

    return {
      timeStampDimension,
      timeStampGroup,
      statusCodeDimension,
      statusCodeGroup,
      responseTimeDimension,
      responseTimeGroup,
      timeScaleForLine,
      timeScaleForFocus,
      xScaleForBar,
      binwidth
    };
  }

  instance.renderCharts = function (parsedData) {

    const {
      timeStampDimension,
      timeStampGroup,
      statusCodeDimension,
      statusCodeGroup,
      responseTimeDimension,
      responseTimeGroup,
      timeScaleForLine,
      timeScaleForFocus,
      xScaleForBar,
      binwidth
    } = parsedData;

    // Init charts
    const line = dc.lineChart('#line-chart');
    const focus = dc.barChart('#focus-chart');
    const row = dc.rowChart('#row-chart');
    const bar = dc.barChart('#bar-chart');

    line
      .height(350)
      .renderArea(true)
      .transitionDuration(300)
      .margins({top: 5, right: 20, bottom: 25, left: 40})
      .x(timeScaleForLine)
      .dimension(timeStampDimension)
      .group(timeStampGroup)
      .rangeChart(focus)
      .brushOn(false)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      .elasticY(true);

    focus
      .height(100)
      .dimension(timeStampDimension)
      .group(timeStampGroup)
      .xUnits(dc.units.fp.precision(binwidth))
      .centerBar(true)
      .gap(1)
      .margins({top: 5, right: 20, bottom: 25, left: 40})
      .x(timeScaleForFocus)
      .alwaysUseRounding(true)
      .elasticY(true)
      .yAxis().ticks(0);

    row
      .height(215)
      .transitionDuration(300)
      .dimension(statusCodeDimension)
      .group(statusCodeGroup)
      .elasticX(true)
      .xAxis().ticks(5);

    bar
      .height(215)
      .transitionDuration(300)
      .dimension(responseTimeDimension)
      .group(responseTimeGroup)
      .centerBar(true)
      .xUnits(dc.units.fp.precision(binwidth))
      .margins({top: 5, right: 20, bottom: 25, left: 45})
      .brushOn(true)
      .x(xScaleForBar)
      .renderHorizontalGridLines(true)
      .xAxis().ticks(10);

    dc.renderAll(); // Render all charts

    // Iterate throuh each chart in a registry & set listeners for filtering
    _.forEach(dc.chartRegistry.list(), (chart) => {
      chart.on("filtered", () => {
        instance.updateDataTable(timeStampDimension);
        instance.updateLineChart(line, focus, timeScaleForLine);
      });
    });

    instance.updateDataTable(timeStampDimension);
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
  instance.updateLineChart = function (line, focus, timeScaleForLine) {

    // Get current time range
    const selectedTimeRange = focus.filter();

    // Check if filter was set
    if (selectedTimeRange) {
      line.x(d3.time.scale().domain(selectedTimeRange));
    } else {
      line.x(timeScaleForLine);
    }
  }

});

Template.chartsLayout.onRendered(function () {

  const instance = this;

  // Get reference to chart html elemets
  const chartElemets = $('#line-chart, #focus-chart, #row-chart, #bar-chart');

  chartElemets.addClass('loader'); // Set loader

  instance.autorun(() => {

    const chartData = instance.esData.get(); // Get elasticsearch data

    if (chartData) {

      const parsedData = instance.parseChartData(chartData); // Parse ES data

      instance.renderCharts(parsedData); // Render chart with data

      chartElemets.removeClass('loader'); // Unset loader
    }
  });
});

Template.chartsLayout.helpers({
  tableDataSet () {
    const instance = Template.instance();
    return instance.tableDataSet.get();
  },
  itemsCount () {
    const instance = Template.instance();
    return {
      filterItemsCount: instance.filterItemsCount.get(),
      totalItemsCount: instance.totalItemsCount.get()
    }
  }
})
