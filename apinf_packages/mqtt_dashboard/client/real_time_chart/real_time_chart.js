/* Copyright 2017 Apinf Oy
  instance file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// NPM packages
import moment from 'moment';
import Chart from 'chart.js';

// APInf import
import { arrayWithZeros, generateDate } from '../chart_helpers';

Template.displayRealTimeChart.onRendered(function () {
  const instance = this;
  const queryOptions = instance.data.queryOptions;
  const aggregatedData = instance.data.chart.dataset;

  // Create Labels for particular Date range & interval
  const labels = generateDate({
    startAt: moment(queryOptions.from).seconds(0),
    endAt: moment(queryOptions.to).seconds(0),
    format: 'HH:mm',
    interval: queryOptions.interval,
  });

  const data = arrayWithZeros(labels.length);

  // Build data for chart
  aggregatedData.forEach(value => {
    // Create Labels values
    const currentDateValue = moment(value.key).format('HH:mm');
    // Find spot
    const index = labels.indexOf(currentDateValue);
    // Replace "0" to the value
    data[index] = value.doc_count;
  });

  instance.autorun(() => {
    const chart = Template.currentData().chart;

    if (chart && instance.chart) {
      const chartLabels = instance.chart.data.labels;
      const chartData = instance.chart.data.datasets[0].data;

      // Reset real-time chart
      if (chart.reset) {
        instance.chart.data.labels = [];
        instance.chart.data.datasets[0].data = [];
      }

      // Format date
      const date = moment(chart.dataset[0].key).format('HH:mm');

      // Add a new dataset to existing
      chartLabels.push(date);
      chartData.push(chart.dataset[0].doc_count);

      // Update labels & data, remove the first point
      instance.chart.data.labels = chartLabels.slice(1);
      instance.chart.data.datasets[0].data = chartData.slice(1);

      // Update chart
      instance.chart.update();
    }
  });

  // get document element
  const canvas = document.querySelector(`#${instance.data.query}`);
  // Realize chart
  instance.chart = new Chart(canvas.getContext('2d'), {
    // The type of chart
    type: 'line',
    // Data for displaying chart
    data: {
      labels,
      datasets: [
        {
          backgroundColor: '#e3f2fc',
          borderColor: '#3886d4',
          borderWidth: 2,
          data,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    },
    // Configuration options
    options: {
      scales: {
        xAxes: [{
          display: true,
        }],
        yAxes: [{
          display: true,
          ticks: {
            beginAtZero: true,
          },
        }],

      },
      legend: {
        display: false,
      },
      elements: {
        line: {
          tension: 0, // disables bezier curves
        },
      },
      animation: {
        duration: 0, // general animation time
      },
      hover: {
        animationDuration: 0, // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0, // animation duration after a resize
    },
  });
});
