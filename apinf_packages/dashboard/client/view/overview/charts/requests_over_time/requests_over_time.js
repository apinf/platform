/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages import
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import moment from 'moment';
import Chart from 'chart.js';

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
      },
    },
  });

  // Update reactively when Elasticsearch data is updated
  instance.autorun(() => {
    // Get ElasticSearch aggregated data
    const elasticsearchData = Template.currentData().buckets;

    // Get Labels for chart
    const labels = elasticsearchData.map(value => {
      // TODO: internationalize date formatting
      return moment(value.key).format('MM/DD');
    });

    const data = elasticsearchData.map(value => {
      return value.doc_count;
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
