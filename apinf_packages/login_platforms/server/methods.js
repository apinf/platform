/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { ServiceConfiguration } from 'meteor/service-configuration';

// Collection imports
import Settings from '/apinf_packages/settings/collection';
import LoginPlatforms from '../collection';

// Helper object to organize save functions for each service configuration
const updateFunctions = {
  saveGithubConfiguration (settings) {
    // remove existing configuration
    ServiceConfiguration.configurations.remove({
      service: 'github',
    });

    // Insert new service configuration if there are parameters given
    if (settings.githubConfiguration) {
      ServiceConfiguration.configurations.insert({
        service: 'github',
        clientId: settings.githubConfiguration.clientId,
        secret: settings.githubConfiguration.secret,
      });
    }

    // Return status message
    return 'GitHub configuration updated successfully';
  },
  saveFiwareConfiguration (settings) {
    // remove existing configuration
    ServiceConfiguration.configurations.remove({
      service: 'fiware',
    });

    // Insert new service configuration if there are parameters given
    if (settings.fiwareConfiguration) {
      ServiceConfiguration.configurations.insert({
        service: 'fiware',
        clientId: settings.fiwareConfiguration.clientId,
        rootURL: settings.fiwareConfiguration.rootURL,
        secret: settings.fiwareConfiguration.secret,
      });
    }

    // Return status message
    return 'FIWARE configuration updated successfully';
  },
  saveHslConfiguration (settings) {
    // remove existing configuration
    ServiceConfiguration.configurations.remove({
      service: 'hsl',
    });

    // Insert new service configuration if there are parameters given
    if (settings.hslConfiguration) {
      ServiceConfiguration.configurations.insert({
        service: 'hsl',
        clientId: settings.hslConfiguration.clientId,
        secret: settings.hslConfiguration.secret,
        serverUrl: settings.hslConfiguration.serverUrl,
        authorizationEndpoint: settings.hslConfiguration.authorizationEndpoint,
        tokenEndpoint: settings.hslConfiguration.tokenEndpoint,
        userinfoEndpoint: settings.hslConfiguration.userinfoEndpoint,
   //     idTokenWhitelistFields: settings.hslConfiguration.idTokenWhitelistFields || [],
      });
    }

    // Return status message
    return 'OIDC configuration updated successfully';
  },
};

Meteor.methods({
  updateLoginPlatformsConfiguration () {
    // DB ServiceConfiguration is updated to be same as LoginPlatforms

    // Status variable returned to client
    let status = null;

    // Try if settings exist
    try {
      const settings = LoginPlatforms.findOne();
      // Update configuration according to LoginPlatform data
      status = updateFunctions.saveGithubConfiguration(settings);
      status = updateFunctions.saveFiwareConfiguration(settings);
      status = updateFunctions.saveHslConfiguration(settings);
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

Meteor.methods({
  updateLoginPlatformsFromConfiguration () {
    // DB LoginPlatforms is updated to be same as ServiceConfiguration

    // Variable to be returned to client
    let loginParameterId;
    let changesFound = false;

    // Try if settings exist
    try {
      // Get loginPlatform data
      const loginParameters = LoginPlatforms.findOne() || {};
      if (loginParameters._id) {
        loginParameterId = loginParameters._id;
        delete loginParameters._id;
      }
      // If data in dbs is different, modify loginPlatforms according to
      // ServiceConfiguration

      // Read Github parameters from ServiceConfiguration
      const configGithubParameters = ServiceConfiguration.configurations
      .findOne({ service: 'github' });

      // Check Github
      if (!configGithubParameters) {
        // Remove possible login parameters, if no configuration
        if (loginParameters && loginParameters.githubConfiguration) {
          delete loginParameters.githubConfiguration;
          changesFound = true;
        }
      } else if (!loginParameters ||
                !loginParameters.githubConfiguration ||
                loginParameters.githubConfiguration.clientId !==
                  configGithubParameters.clientId ||
                loginParameters.githubConfiguration.secret !==
                  configGithubParameters.secret) {
        // values from configuration
        const githubConfiguration = {
          clientId: configGithubParameters.clientId,
          secret: configGithubParameters.secret,
        };
        // Store github parameters
        loginParameters.githubConfiguration = githubConfiguration;
        changesFound = true;
      }

      // Get parameters for fiware from configuration DB
      const configFiwareParameters = ServiceConfiguration.configurations
      .findOne({ service: 'fiware' });

      // Check Fiware
      if (!configFiwareParameters) {
        // Remove possible login parameters, if no configuration
        if (loginParameters && loginParameters.fiwareConfiguration) {
          delete loginParameters.fiwareConfiguration;
          changesFound = true;
        }
      } else if (!loginParameters ||
                !loginParameters.fiwareConfiguration ||
                loginParameters.fiwareConfiguration.clientId !==
                  configFiwareParameters.clientId ||
                loginParameters.fiwareConfiguration.secret !==
                  configFiwareParameters.secret ||
                loginParameters.fiwareConfiguration.rootURL !==
                  configFiwareParameters.rootURL) {
        // values from configuration
        const fiwareConfiguration = {
          clientId: configFiwareParameters.clientId,
          secret: configFiwareParameters.secret,
          rootURL: configFiwareParameters.rootURL,
        };
        // Store fiware values
        loginParameters.fiwareConfiguration = fiwareConfiguration;
        changesFound = true;
      }
      // Get parameters for OIDC from configuration DB
      const configHslParameters = ServiceConfiguration.configurations
      .findOne({ service: 'hsl' });

      // Check OIDC
      if (!configHslParameters) {
        // Remove possible login parameters, if no configuration
        if (loginParameters && loginParameters.hslConfiguration) {
          delete loginParameters.hslConfiguration;
          changesFound = true;
        }
      } else if (!loginParameters ||
                !loginParameters.hslConfiguration ||
                loginParameters.hslConfiguration.clientId !==
                  configHslParameters.clientId ||
                loginParameters.hslConfiguration.secret !==
                  configHslParameters.secret ||
                loginParameters.hslConfiguration.serverUrl !==
                  configHslParameters.serverUrl ||
                loginParameters.hslConfiguration.authorizationEndpoint !==
                  configHslParameters.authorizationEndpoint ||
                loginParameters.hslConfiguration.tokenEndpoint !==
                  configHslParameters.tokenEndpoint ||
                loginParameters.hslConfiguration.userinfoEndpoint !==
                  configHslParameters.userinfoEndpoint) {
        // values from configuration
        const hslConfiguration = {
          clientId: configHslParameters.clientId,
          secret: configHslParameters.secret,
          serverUrl: configHslParameters.serverUrl,
          authorizationEndpoint: configHslParameters.authorizationEndpoint,
          tokenEndpoint: configHslParameters.tokenEndpoint,
          userinfoEndpoint: configHslParameters.userinfoEndpoint,
        };
        // store OIDC values
        loginParameters.hslConfiguration = hslConfiguration;
        changesFound = true;
      }

      // In case values were different, update Login values with Config values
      if (changesFound) {
        if (loginParameters) {
          LoginPlatforms.remove(loginParameterId);
        }
        LoginPlatforms.insert(loginParameters);
      }
    } catch (error) {
      // otherwise show an error
      const message = `Update gitHub configuration: ${error}`;

      // Show an error message
      throw new Meteor.Error(message);
    }

    // Return method status to the client
    return true;
  },
});

