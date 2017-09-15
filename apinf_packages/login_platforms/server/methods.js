/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { ServiceConfiguration } from 'meteor/service-configuration';

// APInf imports
import {
  githubSettingsValid,
  fiwareSettingsValid,
} from '/apinf_packages/core/helper_functions/validate_settings';

// Collection imports
import LoginPlatforms from '../collection';

// Helper object to organize save functions for each service configuration
const updateFunctions = {
  saveGithubConfiguration (settings) {
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

    // Return status message
    return 'GitHub configuration updated successfully';
  },
  saveFiwareConfiguration (settings) {
    // remove existing configuration
    ServiceConfiguration.configurations.remove({
      service: 'fiware',
    });

    // Insert new service configuration
    ServiceConfiguration.configurations.insert({
      service: 'fiware',
      clientId: settings.fiwareConfiguration.clientId,
      rootURL: settings.fiwareConfiguration.rootURL,
      secret: settings.fiwareConfiguration.secret,
    });

    // Return status message
    return 'FIWARE configuration updated successfully';
  },
}

Meteor.methods({
  updateLoginPlatformsConfiguration () {
    // Status variable returned to client
    let status = null;

    // Try if settings exist
    try {
      const settings = LoginPlatforms.findOne();

      // Check if github settings are valid
      if (githubSettingsValid(settings)) {
        status = updateFunctions.saveGithubConfiguration(settings)
      } else if (fiwareSettingsValid(settings)) {
        status = updateFunctions.saveFiwareConfiguration(settings)
      } else {
        // Throw excpetion if githubSettings are not valid
        throw new Error();
      }
    } catch (error) {
      // otherwise show an error
      const message = `Update gitHub configuration: ${error}`;

      // Show an error message
      throw new Meteor.Error(message);
    }

    // Return method status to the client
    return status;
  },
});
