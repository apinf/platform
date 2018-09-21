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
  oidcSettingsValid,
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
  saveOidcConfiguration (settings) {
    // remove existing configuration
    ServiceConfiguration.configurations.remove({
      service: 'oidc',
    });

    // Insert new service configuration if there are parameters given
    if (settings.oidcConfiguration) {
      ServiceConfiguration.configurations.insert({
        service: 'oidc',
        loginStyle: 'popup',
        clientId: settings.oidcConfiguration.clientId,
        secret: settings.oidcConfiguration.secret,
        serverUrl: settings.oidcConfiguration.serverUrl,
        authorizationEndpoint: settings.oidcConfiguration.authorizationEndpoint,
        tokenEndpoint: settings.oidcConfiguration.tokenEndpoint,
        userinfoEndpoint: settings.oidcConfiguration.userinfoEndpoint,
      });
    }

    // Return status message
    return 'OIDC configuration updated successfully';
  },
};

Meteor.methods({
  updateLoginPlatformsConfiguration () {
    // Status variable returned to client
    let status = null;

    // Try if settings exist
    try {
      const settings = LoginPlatforms.findOne();
      // Update configuration according to LoginPlatform data
      status = updateFunctions.saveGithubConfiguration(settings);
      status = updateFunctions.saveFiwareConfiguration(settings);
      status = updateFunctions.saveOidcConfiguration(settings);
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
    // Variable to be returned to client
    let parameters = {};
    let loginParameterId;
    let changesFound = false;

    // Try if settings exist
    try {
      const loginParameters = LoginPlatforms.findOne() || {};
      if (loginParameters._id) {
        loginParameterId = loginParameters._id;
        delete loginParameters._id;
      }
      // Read Github parameters from ServiceConfiguration
      const configGithubParameters = ServiceConfiguration.configurations
      .findOne({ service: 'github' });

      // If data in dbs is different, modify loginPlatforms according to
      // ServiceConfiguration

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
                  configGithubParameters.clientId   ||
                loginParameters.githubConfiguration.secret !==
                  configGithubParameters.secret      ) {

        // values from configuration
        const githubConfiguration = {
          clientId: configGithubParameters.clientId,
          secret: configGithubParameters.secret,
        };
        // Store github parameters
        loginParameters.githubConfiguration = githubConfiguration;
        changesFound = true;
      }

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
                  configFiwareParameters.clientId   ||
                loginParameters.fiwareConfiguration.secret !==
                  configFiwareParameters.secret     ||
                loginParameters.fiwareConfiguration.rootURL !==
                  configFiwareParameters.rootURL ) {

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

      const configOidcParameters = ServiceConfiguration.configurations
      .findOne({ service: 'oidc' });

      // Check OIDC
      if (!configOidcParameters) {
        // Remove possible login parameters, if no configuration
        if (loginParameters && loginParameters.oidcConfiguration) {
          delete loginParameters.oidcConfiguration;
          changesFound = true;
        }
      } else if (!loginParameters ||
                !loginParameters.oidcConfiguration ||
                loginParameters.oidcConfiguration.clientId !==
                  configOidcParameters.clientId   ||
                loginParameters.oidcConfiguration.secret !==
                  configOidcParameters.secret     ||
                loginParameters.oidcConfiguration.serverUrl !==
                  configOidcParameters.serverUrl ||
                loginParameters.oidcConfiguration.authorizationEndpoint !==
                  configOidcParameters.authorizationEndpoint ||
                loginParameters.oidcConfiguration.tokenEndpoint !==
                  configOidcParameters.tokenEndpoint  ||
                loginParameters.oidcConfiguration.userinfoEndpoint !==
                  configOidcParameters.userinfoEndpoint  ) {

        // values from configuration
        const oidcConfiguration = {
          clientId: configOidcParameters.clientId,
          secret: configOidcParameters.secret,
          serverUrl: configOidcParameters.serverUrl,
          authorizationEndpoint: configOidcParameters.authorizationEndpoint,
          tokenEndpoint: configOidcParameters.tokenEndpoint,
          userinfoEndpoint: configOidcParameters.userinfoEndpoint,
        };
        // store OIDC values
        loginParameters.oidcConfiguration = oidcConfiguration;
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
    return parameters;
  },
});
