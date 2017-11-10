/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
// Discover chimp-js browser
/* globals browser */

import signUpPage from '../../page-objects/signup.page';

describe('01 sign up', () => {
  before(() => {
    signUpPage.open();
  });

  describe('render', () => {
    it('should show username field', () => {
      signUpPage.usernameField.isVisible().should.be.true;
    });

    it('should not show username error field', () => {
      signUpPage.usernameErrorField.isVisible().should.be.false;
    });

    it('should show email field', () => {
      signUpPage.emailField.isVisible().should.be.true;
    });

    it('should not show email error field', () => {
      signUpPage.emailErrorField.isVisible().should.be.false;
    });

    it('should show password field', () => {
      signUpPage.passwordField.isVisible().should.be.true;
    });

    it('should not show password error field', () => {
      signUpPage.passwordErrorField.isVisible().should.be.false;
    });

    it('should show confirm password field', () => {
      signUpPage.confirmPasswordField.isVisible().should.be.true;
    });

    it('should not show confirmPassword error field', () => {
      signUpPage.confirmPasswordErrorField.isVisible().should.be.false;
    });

    it('should show github button', () => {
      signUpPage.githubButton.isVisible().should.be.true;
    });

    it('should show fiware button', () => {
      signUpPage.fiwareButton.isVisible().should.be.true;
    });

    it('should show register button', () => {
      signUpPage.registerButton.isVisible().should.be.true;
    });
  });

  describe('username', () => {
    it('should be required', () => {
      signUpPage.submit();
      signUpPage.usernameErrorField.isVisible().should.be.true;
      signUpPage.usernameErrorField.getText().should.not.be.empty;
    });
  });

  describe('email', () => {
    it('should be required', () => {
      signUpPage.submit();
      signUpPage.emailErrorField.isVisible().should.be.true;
      signUpPage.emailErrorField.getText().should.not.be.empty;
    });

    it('should be invalid for email without domain', () => {
      signUpPage.emailField.setValue('invalid-email');
      signUpPage.submit();
      signUpPage.emailErrorField.isVisible().should.be.true;
      signUpPage.emailErrorField.getText().should.not.be.empty;
    });

    it('should be invalid for email with invalid domain', () => {
      signUpPage.emailField.setValue('invalid-email@mail');
      signUpPage.submit();
      signUpPage.emailErrorField.isVisible().should.be.true;
      signUpPage.emailErrorField.getText().should.not.be.empty;
    });

    // Skip this test because current interface accepts email with space
    it('should be invalid for email space', () => {
      signUpPage.emailField.setValue('invalid email@mail.com');
      signUpPage.submit();
      signUpPage.emailErrorField.isVisible().should.be.true;
      signUpPage.emailErrorField.getText().should.not.be.empty;
    });
  });

  describe('password', () => {
    it('should be required', () => {
      signUpPage.submit();
      signUpPage.passwordErrorField.isVisible().should.be.true;
      signUpPage.passwordErrorField.getText().should.not.be.empty;
    });
  });

  describe('confirm-password', () => {
    it('should be required', () => {
      signUpPage.submit();
      signUpPage.confirmPasswordErrorField.isVisible().should.be.true;
      signUpPage.confirmPasswordErrorField.getText().should.not.be.empty;
    });

    it('should be invalid if different from password', () => {
      signUpPage.passwordField.setValue('password');
      signUpPage.submit();
      signUpPage.confirmPasswordErrorField.isVisible().should.be.true;
      signUpPage.confirmPasswordErrorField.getText().should.not.be.empty;
    });
  });
});
