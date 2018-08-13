import {
  githubSettingsValid,
} from '/apinf_packages/core/helper_functions/validate_settings';

import LoginPlatforms from '../../login_platforms/collection';

// Meteor contributed packages imports
import { ServiceConfiguration } from 'meteor/service-configuration';

const settings = LoginPlatforms.findOne();

// Check if github settings are valid
if (githubSettingsValid(settings)) {
  ServiceConfiguration.configurations.upsert({ service: 'github' }, {
    $set: {
      clientId: settings.githubConfiguration.clientId,
      secret: settings.githubConfiguration.secret,
      loginStyle: 'popup',
    }
  });
}
