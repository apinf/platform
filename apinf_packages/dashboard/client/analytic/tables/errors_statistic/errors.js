/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { saveAs } from 'meteor/pfafman:filesaver';

// NPM imports
import json2csv from 'json2csv';

Template.errorsStatisticTable.onCreated(function () {
  const instance = this;
  // Get value of selected language
  const language = TAPi18n.getLanguage();

  instance.autorun(() => {
    const aggregatedData = Template.currentData().timelineData;

    // Init
    instance.errors = [];

    aggregatedData.forEach(dataset => {
      const requestPath = dataset.key;

      dataset.errors_statistic.errors_over_time.buckets.forEach(date => {
        date.status.buckets.forEach(status => {
          const error = {
            // Get value of request path
            path: requestPath,
            // Get value of request date
            date: new Date(date.key).toLocaleString(language),
            // Get values of request code status
            status: status.key,
            // Get value of request number
            calls: status.doc_count,
          };

          instance.errors.push(error);
        });
      });
    });
  });
});

Template.errorsStatisticTable.helpers({
  errors () {
    const instance = Template.instance();

    // Get only first 6 items of list
    return instance.errors.slice(0, 6);
  },
  allErrorsCount () {
    // Return count of all errors
    return Template.instance().errors.length;
  },
});

Template.errorsStatisticTable.events({
  'click #generate-errors-log': (event, templateInstance) => {
    const fields = ['date', 'status', 'calls', 'path'];
    // converts from json to csv
    const csv = json2csv({ data: templateInstance.errors, fields });
    // creates file object with content type of text/plain
    const file = new Blob([csv], { type: 'text/plain' });
    // forces "save As" function allow user download file
    saveAs(file, 'error_statistic.csv');
  },
});
