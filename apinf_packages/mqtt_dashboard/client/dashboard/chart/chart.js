/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// NPM packages
import moment from 'moment';
import Chart from '../../../../../node_modules/chart.js/src/chart';
import { arrayWithZeros, generateDate } from '../../chart_helpers';

Template.mqttDashboardDisplayRealTimeChart.onRendered(function () {
  // get document element
  const canvas = document.querySelector(`#${this.data.query}`);

  // Realize chart
  this.chart = new Chart(canvas.getContext('2d'), {
    // The type of chart
    type: 'line',
    // Data for displaying chart
    data: {
      labels: [],
      datasets: [
        {
          backgroundColor: 'rgba(26, 117, 210, 0.2)',
          borderColor: 'rgb(26, 117, 210)',
          borderWidth: 2,
          data: [],
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      scales: {
        xAxes: [{
          display: false,
        }],
        yAxes: [{
          display: false,
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
      layout: {
        padding: {
          left: 5,
          right: 5,
          top: 10,
          bottom: 5,
        },
      },
    },
  });

  this.autorun(() => {
    const queryOptions = this.data.queryOptions;
    const chartData = Template.currentData().chartData;

    if (chartData && this.chart) {
      // Create Labels for particular Date range & interval
      const labels = generateDate({
        startAt: moment(queryOptions.from).minutes(0).seconds(0),
        endAt: moment(queryOptions.to).minutes(0).seconds(0),
        format: 'HH:mm',
        interval: queryOptions.interval,
      });

      const data = arrayWithZeros(labels.length);

      // Build data for chart
      chartData.forEach(value => {
        // Format Date
        const currentDateValue = moment(value.key).format('HH:mm');
        // Find spot
        const index = labels.indexOf(currentDateValue);
        // Replace "0" to the value
        data[index] = value.doc_count;
      });

      // Update labels & data
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      // Update chart
      this.chart.update();
    }
  });
});
