/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Migrations } from 'meteor/percolate:migrations';

// Collection imports
import Branding from '/apinf_packages/branding/collection';

Migrations.add({
  version: 13,
  name: 'Adds the colors field for branding if it has not been created yet',
  up () {
    const branding = Branding.findOne();

    // Make sure branding exists
    if (branding) {
      // Create color schema object
      const colorSchema = branding.colors || {};

      // Get primary color from simple schema
      const primary = Branding.simpleSchema().schema('colors.primary').defaultValue;
      // Get primary text color from simple schema
      const primaryText = Branding.simpleSchema().schema('colors.primaryText').defaultValue;
      // Get cover photo overlay from simple schema
      const coverPhotoOverlay = Branding.simpleSchema()
        .schema('colors.coverPhotoOverlay').defaultValue;
      // Get overlay transparency from simple schema
      const overlayTransparency = Branding.simpleSchema()
        .schema('colors.overlayTransparency').defaultValue;

      // Assign default value
      colorSchema.primary = colorSchema.primary || primary;
      colorSchema.primaryText = colorSchema.primaryText || primaryText;
      colorSchema.coverPhotoOverlay = colorSchema.coverPhotoOverlay || coverPhotoOverlay;
      colorSchema.overlayTransparency = colorSchema.overlayTransparency || overlayTransparency;

      // Update branding
      Branding.update({}, { $set: { colors: colorSchema } });
    } else {
      // Insert branding schema default value
      Branding.insert({});
    }
  },
});
