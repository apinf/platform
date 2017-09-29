/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { Migrations } from 'meteor/percolate:migrations';

// Collection imports
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

Migrations.add({
  version: 10,
  name: 'Ensure all proxy backends have the type field',
  up () {
    // Update proxy backends are connected to API Umbrella proxy type
    ProxyBackends.update(
      { type: { $exists: false }, 'apiUmbrella.name': { $exists: true } },
      { $set: { type: 'apiUmbrella' } }
      );
  },
});
