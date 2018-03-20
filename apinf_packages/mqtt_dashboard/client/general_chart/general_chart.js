/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

import moment from 'moment';
import Chart from 'chart.js';
import { arrayWithZeros, generateDate } from '../chart_helpers';

Template.displayGeneralChart.onRendered(function () {
  const format = this.data.format;
  const queryOptions = this.data.queryOptions;
  const chart = this.data.chart;

  // Create Labels for particular Date range & interval
  const labels = generateDate({
    startAt: moment(queryOptions.from).minutes(0).seconds(0),
    endAt: moment(queryOptions.to).minutes(0).seconds(0),
    format,
    interval: queryOptions.interval,
  });

  // Build an Array with "0" values
  const data = arrayWithZeros(labels.length);

  // Build data for chart
  chart.dataset.forEach(value => {
    // Format Date
    const currentDateValue = moment(value.key).format(format);
    // Find spot
    const index = labels.indexOf(currentDateValue);
    // Replace "0" to the value
    data[index] = value.doc_count;
  });

  // If "Last 24 hours" is selected
  if (this.data.format === 'HH:mm') {
    // Get Day of previous date
    const date = moment().subtract(1, 'd').format('DD.MM');
    // Update the first label (DD.MM HH:mm)
    labels[0] = `${date} ${labels[0]}`;
  }

  const querySelector = `#${this.data.query}`;
  // Get document element
  const canvas = document.querySelector(querySelector);
  // Realize chart
  this.chart = new Chart(canvas.getContext('2d'), {
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
