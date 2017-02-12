import { Migrations } from 'meteor/percolate:migrations';

import Settings from '/settings/collection';
import { Proxies } from '/proxies/collection';

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
