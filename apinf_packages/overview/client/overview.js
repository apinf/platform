/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

Template.overview.onRendered(() => {
  const ctx = document.getElementById('test');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['One', 'Two', 'Three', 'Four', 'Five', 'Six'],
      datasets: [{
        data: [
          12, 19, 3, 5, 2, 3,
        ],
      }],
    },
    options: {
      legend: {
        display: false,
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
});
