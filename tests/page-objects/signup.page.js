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

  get errorFields () { return browser.elements('span.help-block'); }

  get usernameErrorField () { return this.errorFields[0]; }
  get emailErrorField () { return this.errorFields[1]; }
  get passwordErrorField () { return this.errorFields[2]; }
  get confirmPasswordErrorField () { return this.errorFields[3]; }

  open () {
    super.open();
    super.open('sign-up');
  }

  // registerNewUser ({ username, email, password }) {
  //   this.nameField.waitForVisible(5000);
  //   this.nameField.setValue(username);
  //   this.emailField.setValue(email);
  //   this.passwordField.setValue(password);
  //   this.confirmPasswordField.setValue(password);

  //   this.submit();
  // }

  // registerNewAdmin ({ adminUsername, adminEmail, adminPassword }) {
  //   this.nameField.waitForVisible(5000);
  //   this.nameField.setValue(adminUsername);
  //   this.emailField.setValue(adminEmail);
  //   this.passwordField.setValue(adminPassword);
  //   this.confirmPasswordField.setValue(adminPassword);

  //   this.submit();
  // }

  // gotToRegister () {
  //   this.registerButton.waitForVisible(5000);
  //   this.registerButton.click();
  // }
}

module.exports = new SignUpPage();
