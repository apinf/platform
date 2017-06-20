/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* globals browser */

import Page from './page';

class SignUpPage extends Page {

  get usernameField () { return browser.element('#at-field-username'); }
  get emailField () { return browser.element('#at-field-email'); }
  get passwordField () { return browser.element('#at-field-password'); }
  get confirmPasswordField () { return browser.element('#at-field-password_again'); }

  get registerButton () { return browser.element('button#at-btn.submit'); }
  get githubButton () { return browser.element('button#at-github'); }

  get errorFields () { return this.$$('.help-block'); }

  get usernameErrorField () { return this.errorFields[0]; }
  get emailErrorField () { return this.errorFields[1]; }
  get passwordErrorField () { return this.errorFields[2]; }
  get confirmPasswordErrorField () { return this.errorFields[3]; }

  // Modal after first signup
  get settingsLink () { return browser.element('#setup-settings') }

  open () {
    super.open();
    this.pause();
    super.open('sign-up');
  }

  registerNewUser ({ username, email, password }) {
    this.usernameField.waitForVisible(5000);
    this.usernameField.setValue(username);
    this.emailField.setValue(email);
    this.passwordField.setValue(password);
    this.confirmPasswordField.setValue(password);

    this.submit();
  }

  gotToSetup () {
    this.settingsLink.waitForVisible(5000);
    this.settingsLink.click();
  }

  submit () {
    this.registerButton.waitForVisible(5000);
    this.registerButton.click();
  }
}

module.exports = new SignUpPage();
