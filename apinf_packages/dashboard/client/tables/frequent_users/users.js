/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';
import { saveAs } from 'meteor/pfafman:filesaver';

// NPM imports
import json2csv from 'json2csv';

Template.mostFrequentUsersTable.onCreated(function () {
  const instance = this;

  instance.autorun(() => {
    // Get aggregated data about users
    const frequentUsers = Template.currentData().frequentUsers;

    // Init
    instance.users = [];

    frequentUsers.forEach(userDataset => {
      userDataset.request_path.buckets.forEach(request => {
        const user = {
          apiKey: userDataset.key,
          calls: request.doc_count,
          url: request.key,
        };

        instance.users.push(user);
      });
    });

    // Sort by the highest calls
    instance.users.sort((a, b) => {
      return b.calls - a.calls;
    });
  });
});

Template.mostFrequentUsersTable.helpers({
  users () {
    const instance = Template.instance();

    // Get only first 6 items of list
    return instance.users.slice(0, 6);
  },
  allUsersCount () {
    // Return count of all users
    return Template.instance().users.length;
  },
});

Template.mostFrequentUsersTable.events({
  'click #generate-users-log': (event, templateInstance) => {
    const fields = ['apiKey', 'calls', 'url'];
    // converts from json to csv
    const csv = json2csv({ data: templateInstance.users, fields });
    // creates file object with content type of text/plain
    const file = new Blob([csv], { type: 'text/plain' });
    // forces "save As" function allow user download file
    saveAs(file, 'user_statistic.csv');
  },
});
