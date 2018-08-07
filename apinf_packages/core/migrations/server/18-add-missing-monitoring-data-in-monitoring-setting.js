/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { Migrations } from 'meteor/percolate:migrations';

// Collection imports
import { MonitoringSettings, MonitoringData } from '/apinf_packages/monitoring/collection';

Migrations.add({
  version: 18,
  name: 'Add Missing Migration Data Id in Migration Setting table',
  up () {
    // Iterate through MonitoringSettings collection
    MonitoringSettings.find({}).forEach((monitoringSetting) => {
      if (monitoringSetting.data === 'false') {
        const apiId = monitoringSetting.apiId;
        MonitoringData.insert({ apiId }, (insertError, id) => {
        // Linked both collections
          MonitoringSettings.update(monitoringSetting._id, { $set: { data: id } });
        });
      }
    });
  },
});
