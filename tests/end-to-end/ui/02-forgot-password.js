/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
// Discover chimp-js browser
/* globals browser */
/* eslint-disable no-console */

import signInPage from '../../page-objects/signin.page';

describe('02 forgot password', () => {
  before(() => {
    signInPage.open();
    signInPage.gotToForgotPassword();
  });

  describe('render', () => {
    it('should show email field', () => {
      signInPage.emailField.isVisible().should.be.true;
    });

    it('should not show email error field', () => {
      signInPage.emailErrorField.isVisible().should.be.false;
    });

    it('should show submit button', () => {
      signInPage.submitButton.isVisible().should.be.true;
      signInPage.submitButton.isEnabled().should.be.true;
    });
  });

  describe('email', () => {
    it('should be required', () => {
      signInPage.submit();
      signInPage.emailErrorField.isVisible().should.be.true;
      signInPage.emailErrorField.getText().should.not.be.empty;

      // TODO: find why webdriver thinks it's enabled while manual test proves the opposite
      // signInPage.submitButton.isEnabled().should.be.false;
    });

    it('should be invalid for email without domain', () => {
      signInPage.emailField.setValue('invalid-email');
      signInPage.submit();
      signInPage.emailErrorField.isVisible().should.be.true;
      signInPage.emailErrorField.getText().should.not.be.empty;
    });

    it('should be invalid for email with invalid domain', () => {
      signInPage.emailField.setValue('invalid-email@mail');
      signInPage.submit();
      signInPage.emailErrorField.isVisible().should.be.true;
      signInPage.emailErrorField.getText().should.not.be.empty;
    });
  });
});
