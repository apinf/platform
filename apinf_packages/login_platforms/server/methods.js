/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { ServiceConfiguration } from 'meteor/service-configuration';

// APInf imports
// eslint-disable-next-line max-len
import { githubSettingsValid, fiwareSettingsValid } from '/apinf_packages/core/helper_functions/validate_settings';

// Collection imports
import LoginPlatforms from '../collection';

Meteor.methods({
  updateGithubConfiguration () {
    // Try if settings exist
    try {
      const settings = LoginPlatforms.findOne();

      // Check if github settings are valid
      if (githubSettingsValid(settings)) {
        // remove existing configuration
        ServiceConfiguration.configurations.remove({
          service: 'github',
        });

        // Insert new service configuration
        ServiceConfiguration.configurations.insert({
          service: 'github',
          clientId: settings.githubConfiguration.clientId,
          secret: settings.githubConfiguration.secret,
        });
      }
    } catch (error) {
      // otherwise show an error
      const message = `Update gitHub configuration: ${error}`;

      // Show an error message
      throw new Meteor.Error(message);
    }
  },
  updateFiwareConfiguration () {
    // Try if settings exist
    try {
      const settings = LoginPlatforms.findOne();

      // Check if fiware settings are valid
      if (fiwareSettingsValid(settings)) {
        // remove existing configuration
        ServiceConfiguration.configurations.remove({
          service: 'fiware',
        });

        // Insert new service configuration
        ServiceConfiguration.configurations.insert({
          service: 'fiware',
          clientId: settings.githubConfiguration.clientId,
          rootURL: settings.githubConfiguration.rootURL,
          secret: settings.githubConfiguration.secret,
        });
      }
    } catch (error) {
      // otherwise show an error
      const message = `Update FIWARE configuration: ${error}`;

      // Show an error message
      throw new Meteor.Error(message);
    }
  },
});
