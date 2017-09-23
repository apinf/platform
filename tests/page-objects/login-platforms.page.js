/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* globals browser */

import Page from './page';

class LoginPlatformsPage extends Page {

  // Left Menu
  get buttonProfileLink () { return browser.element('#button-profile'); }
  get buttonAccountLink () { return browser.element('#button-account'); }
  get buttonBrandingLink () { return browser.element('#button-branding'); }
  get buttonSettingsLink () { return browser.element('#button-settings'); }
  get buttonProxiesLink () { return browser.element('#button-proxies'); }
  get buttonLoginPlatformsLink () { return browser.element('#button-loginPlatforms'); }

  // Login Platforms
  get githubId () { return browser.element('#github-id'); }
  get githubSecret () { return browser.element('#github-secret'); }
  get fiwareId () { return browser.element('#fiware-id'); }
  get fiwareSecret () { return browser.element('#fiware-secret'); }
  get rootURL () { return browser.element('#fiware-rootURL'); }
  get saveSettingsButton () { return browser.element('#save-settings'); }

  setupGithub ({ githubClientId, githubClientSecret }) {
    this.githubId.waitForVisible(5000);

    this.githubId.setValue(githubClientId);
    this.githubSecret.setValue(githubClientSecret);

    this.submit();
  }

  setupFiware ({ fiwareClientId, fiwareClientSecret, rootURL }) {
    this.fiwareId.waitForVisible(5000);

    this.fiwareId.setValue(fiwareClientId);
    this.fiwareSecret.setValue(fiwareClientSecret);
    this.rootURL.setValue(rootURL);

    this.submit();
  }

  submit () {
    this.saveSettingsButton.waitForVisible(5000);
    this.saveSettingsButton.click();
  }
}

module.exports = new LoginPlatformsPage();
