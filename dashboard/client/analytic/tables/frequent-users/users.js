/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

Template.mostFrequentUsersTable.helpers({
  users () {
    const buckets = Template.instance().data.buckets;

    const users = [];

    buckets.forEach(bucket => {
      bucket.request_path.buckets.forEach(request => {
        const user = {};
        // Get value of email
        user.email = bucket.user_email.buckets[0].key;
        // Get value of requests number
        user.calls = request.doc_count;
        // Get value of request_path
        user.url = request.key;

        users.push(user);
      });
    });

    return users;
  },
});
