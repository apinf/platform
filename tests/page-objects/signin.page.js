/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Discover chimp-js browser
/* globals browser */

import Page from './page';

class SignInPage extends Page {
  get emailOrUsernameField () { return browser.element('#at-field-username_and_email'); }
  get passwordField () { return browser.element('#at-field-password'); }

  get submitButton () { return browser.element('button#at-btn.submit'); }
  get githubButton () { return browser.element('button#at-github'); }
  get fiwareButton () { return browser.element('button#at-fiware'); }

  get registerLink () { return browser.element('#at-signUp'); }
  get forgotPasswordLink () { return browser.element('#at-forgotPwd'); }
  get resendVerificationEmailLink () { return browser.element('#at-resend-verification-email'); }

  // This field is only present after clicking on forgot password link
  get emailField () { return browser.element('#at-field-email'); }

  // This field is only present after clicking on forgot password link
  get emailErrorField () { return browser.element('.help-block'); }

  get errorAlert () { return browser.element('.at-error'); }

  open () {
    super.open();
    this.pause();
    super.open('sign-in');
  }

  gotToForgotPassword () {
    this.forgotPasswordLink.waitForVisible(5000);
    this.forgotPasswordLink.click();
  }

  gotToRegister () {
    this.registerLink.waitForVisible(5000);
    this.registerLink.click();
  }

  login ({ email, password }) {
    this.emailOrUsernameField.waitForVisible(5000);
    this.emailOrUsernameField.setValue(email);
    this.passwordField.setValue(password);
    this.submit();
  }

  submit () {
    this.submitButton.waitForVisible(5000);
    this.submitButton.click();
  }
}

module.exports = new SignInPage();
