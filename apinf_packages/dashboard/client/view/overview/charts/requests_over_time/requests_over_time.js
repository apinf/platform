/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages import
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import moment from 'moment';
import Chart from 'chart.js';

// APInf imports
import { generateDate, arrayWithZeros } from '/apinf_packages/dashboard/client/chart_helpers';

Template.requestsOverTime.onRendered(function () {
  const instance = this;

  const id = instance.data.proxyBackendId;
  // Get querySelector to related <canvas>
  const querySelector = `[data-overview-id="${id}"] .requests-over-time-chart`;

  // Realize chart
  const ctx = document.querySelector(querySelector).getContext('2d');
  instance.chart = new Chart(ctx, {
    // The type of chart
    type: 'bar',

    // Data for displaying chart
    data: {
      labels: [],
      datasets: [
        {
          label: TAPi18n.__('requestsOverTime_pointTitle_requests'),
          backgroundColor: '#C6C5C5',
          borderColor: '#959595',
          borderWidth: 1,
        },
      ],
    },

    // Configuration options
    options: {
      legend: {
        display: false,
      },
      layout: {
        padding: {
          left: 10,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
        xAxes: [{
          maxBarThickness: 30,
        }],
      },
    },
  });

  // Update reactively when Elasticsearch data is updated
  instance.autorun(() => {
    // Get ElasticSearch aggregated data
    const elasticsearchData = Template.currentData().buckets;

    // Get current timeframe
    const dateCount = FlowRouter.getQueryParam('timeframe');

    const params = {
      // Date range must have equal length with dateCount value
      // Today value is included then subtract less days
      startDate: moment().subtract(dateCount - 1, 'd'),
      endDate: moment(),
      // Interval is 1 day
      step: 1,
      // TODO: internationalize date formatting
      // https://github.com/apinf/platform/issues/2900
      format: 'MM/DD',
    };

    const labels = generateDate(params);
    const data = arrayWithZeros(dateCount);

    // Get data for bar chart
    elasticsearchData.forEach(value => {
      // Create Labels values
      const currentDateValue = moment(value.key).format(params.format);
      const index = labels.indexOf(currentDateValue);
      data[index] = value.doc_count;
    });

    // Update labels & data
    instance.chart.data.labels = labels;
    instance.chart.data.datasets[0].data = data;

    // Update chart with relevant data
    instance.chart.update();
  });

  // Reactive update Chart Axis translation
  instance.autorun(() => {
    const datasets = instance.chart.data.datasets;

    // Update translation
    datasets[0].label = TAPi18n.__('requestsOverTime_pointTitle_requests');

    // Update chart with new translation
    instance.chart.update();
  });
});
