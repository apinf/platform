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

// APInf imports
import { getLocaleDateFormat } from '/apinf_packages/core/helper_functions/format_date';

Template.uniqueUsersOverTime.onRendered(function () {
  const instance = this;

  const id = instance.data.proxyBackendId;
  // Get querySelector to related <canvas>
  const querySelector = `[data-overview-id="${id}"] .users-chart`;

  // Realize chart
  const ctx = document.querySelector(querySelector).getContext('2d');
  instance.chart = new Chart(ctx, {
    // The type of chart we want
    type: 'line',

    // Data for displaying chart
    data: {
      labels: [],
      datasets: [
        {
          label: TAPi18n.__('uniqueUsersOverTime_pointTitle_users'),
          backgroundColor: 'rgba(26, 117, 210, 0.2)',
          borderColor: 'rgb(26, 117, 210)',
          pointBackgroundColor: 'rgb(26, 117, 210)',
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 4,
        },
      ],
    },

    // Configuration options
    options: {
      elements: {
        line: {
          tension: 0, // disables bezier curves
        },
      },
      legend: {
        display: false,
      },
      layout: {
        padding: {
          left: 0,
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

  // Update reactively when chart data is updated
  instance.autorun(() => {
    // Get aggregated chart data
    const chartData = Template.currentData().chartData;
    // Get Date format
    const dateFormat = Template.currentData().dateFormat;

    // Get locale date format
    const localeDateFormat = getLocaleDateFormat(dateFormat);

    // Get dates
    const labels = chartData.map(dataset => {
      return moment(dataset.date).format(localeDateFormat);
    });

    // Get data for chart
    const data = chartData.map(dataset => {
      return dataset.value;
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
    datasets[0].label = TAPi18n.__('uniqueUsersOverTime_pointTitle_users');

    // Update chart with new translation
    instance.chart.update();
  });
});
