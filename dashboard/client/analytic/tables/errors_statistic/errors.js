/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';

Template.errorsStatisticTable.helpers({
  errors () {
    // Get value of selected language
    const language = TAPi18n.getLanguage();

    const buckets = Template.instance().data.buckets;

    const errors = [];

    buckets.forEach(bucket => {
      const requestPath = bucket.key;

      bucket.errors_statistic.errors_over_time.buckets.forEach(date => {
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

          errors.push(error);
        });
      });
    });

    return errors;
  },
});
