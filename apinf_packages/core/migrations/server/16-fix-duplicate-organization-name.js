/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { Migrations } from 'meteor/percolate:migrations';

// Collection imports
import Organizations from '/apinf_packages/organizations/collection';

Migrations.add({
  version: 16,
  name: 'Fix duplicate Organizations name',
  up () {
    // Get result only for duplicate organization name
    const duplicateOrganizations = Organizations.aggregate([
      { $group: { _id: '$name', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ]);

    // Go through each duplicate organization name
    duplicateOrganizations.forEach((organizationData) => {
      const name = organizationData._id;

      // Find and update each duplicate name
      Organizations.find({ name }).forEach((organization, index) => {
        // Skip first one
        if (index > 0) {
          // Add increasing number as suffix in organization name
          const organizationName = `${organization.name}-${index}`;

          // Update duplicated names are separated with suffix.
          Organizations.update({ _id: organization._id },
            { $set:
              { name: organizationName },
            }
          );
        }
      });
    });
  },
});
