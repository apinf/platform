/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { Migrations } from 'meteor/percolate:migrations';

// Collection imports
import Branding from '/apinf_packages/branding/collection';

Migrations.add({
  version: 12,
  name: 'Change branding schema: migrate to new schema for social media urls',
  up () {
    const socialMediaLinks = {};

    // Get Branding configuration
    const branding = Branding.findOne();

    // Make sure Configuration & social media exist
    if (branding && branding.socialMedia) {
      // Go through all social media
      branding.socialMedia.forEach(social => {
        // Make sure the item isn't null
        if (social) {
          // Lower case the name
          const socialName = social.name.toLowerCase();

          // Make sure it is not duplicate of existing social media
          if (!socialMediaLinks[socialName]) {
            // Create a object
            socialMediaLinks[socialName] = social.url;
          }
        }
      });

      // Update collection
      Branding.update(branding._id, { $set: { socialMediaLinks } });
    }
  },
});
