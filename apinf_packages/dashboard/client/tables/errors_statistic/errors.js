/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { saveAs } from 'meteor/pfafman:filesaver';

// NPM imports
import json2csv from 'json2csv';

Template.errorsStatisticTable.helpers({
  errors () {
    const errors = Template.currentData().errorsStatistic;

    // Get only first 6 items of list
    return errors.slice(0, 20);
  },
  allErrorsCount () {
    // Return count of all errors
    return Template.currentData().errorsStatistic.length;
  },
});

Template.errorsStatisticTable.events({
  'click #generate-errors-log': (event, templateInstance) => {
    const fields = ['date', 'status', 'calls', 'requestPath'];
    const errors = templateInstance.data.errorsStatistic;
    // converts from json to csv
    const csv = json2csv({ data: errors, fields });
    // creates file object with content type of text/plain
    const file = new Blob([csv], { type: 'text/plain' });
    // forces "save As" function allow user download file
    saveAs(file, 'error_statistic.csv');
  },
});
