/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Migrations } from 'meteor/percolate:migrations';

// Collection imports
import Proxies from '/apinf_packages/proxies/collection';
import Settings from '/apinf_packages/settings/collection';

Migrations.add({
  version: 1,
  name: 'Move proxy settings to Proxies collection',
  up () {
    const settings = Settings.findOne();

    // Check settings exist
    if (settings && settings.apiUmbrella) {
      // apiUmbrella/elasticsearch settings to Proxies (addProxy)
      const umbrellaObject = {
        url: settings.apiUmbrella.host,
        apiKey: settings.apiUmbrella.apiKey,
        authToken: settings.apiUmbrella.authToken,
        elasticsearch: settings.elasticsearch.host,
      };

      // New proxy
      const newProxy = {
        name: 'API Umbrella',
        description: 'Umbrella settings, migrated.',
        type: 'apiUmbrella',
        apiUmbrella: umbrellaObject,
      };
      // Insert proxy
      Proxies.insert(newProxy);

      // Update settings doc (remove apiUmbrella & elasticsearch)
      Settings.update({}, { $unset: { apiUmbrella: '', elasticsearch: '' } }, { validate: false });
    }
  },
});
