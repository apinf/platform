/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* globals browser */

import Page from './page';

class SettingsPage extends Page {

  // Left Menu
  get buttonProfileLink () { return browser.element('#button-profile'); }
  get buttonAccountLink () { return browser.element('#button-account'); }
  get buttonBrandingLink () { return browser.element('#button-branding'); }
  get buttonSettingsLink () { return browser.element('#button-settings'); }
  get buttonProxiesLink () { return browser.element('#button-proxies'); }

  // Profile
  get username () { return browser.element('#username'); }
  get company () { return browser.element('#company'); }
  get updateButton () { return browser.element('#update-button'); }

  // Account
  get passwordOld () { return browser.element('#password-old'); }
  get passwordNew () { return browser.element('#password-new'); }
  get passwordNewAgain () { return browser.element('#password-new-again'); }
  get submitPasswordButton () { return browser.element('#submit-password'); }

  // Branding
  get brandingUpdateButton () { return browser.element('#branding-update-button'); }
  get brandingSaveButton () { return browser.element('#branding-save-button'); }

  // Settings
  get githubId () { return browser.element('#github-id'); }
  get githubSecret () { return browser.element('#github-secret'); }
  get saveSettingsButton () { return browser.element('#save-settings'); }

  setupGithub ({ githubClientId, githubClientSecret }) {
    this.githubId.waitForVisible(5000);

    this.githubId.setValue(githubClientId);
    this.githubSecret.setValue(githubClientSecret);

    this.submit();
  }

  submit () {
    this.saveSettingsButton.waitForVisible(5000);
    this.saveSettingsButton.click();
  }
}

module.exports = new SettingsPage();
