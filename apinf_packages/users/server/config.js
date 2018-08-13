import LoginPlatforms from '../../login_platforms/collection';

import {
  githubSettingsValid,
} from '/apinf_packages/core/helper_functions/validate_settings';

const settings = LoginPlatforms.findOne();

// Check if github settings are valid
if (githubSettingsValid(settings)) {
  ServiceConfiguration.configurations.upsert({service: 'github'}, {
    $set: {
      clientId: settings.githubConfiguration.clientId,
      secret: settings.githubConfiguration.secret,
      loginStyle: 'popup'
    }
  });
}
