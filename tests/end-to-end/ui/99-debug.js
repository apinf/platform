import signUpPage from '../../page-objects/signup.page';

describe('99 debug', () => {
  before(() => {
    signUpPage.open();
  });

  describe('render', () => {
    it('should show username field', () => {
      signUpPage.usernameField.isVisible().should.be.true;
    });

    it('should not show username error field', () => {
        console.log(signUpPage.errorFields);
        
        // const usernameErrorField = errorFields[0];
        signUpPage.usernameErrorField.isVisible().should.be.false;
        // signUpPage.errorFields.
    //   console.log(signUpPage.usernameErrorField);
      // signUpPage.usernameErrorField.isVisible().should.be.false;
    });
  });
});