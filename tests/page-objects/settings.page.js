/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* globals browser */

import  MainContentPage from './main-content.page';

class SettingsPage extends  MainContentPage {

  // Left Menu

  // Profile

  // Account

  // Branding

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
