AccountsTemplates.configure({
  confirmPassword: false,
  enablePasswordChange: true,
  forbidClientAccountCreation: false,
  overrideLoginErrors: true,
  // TODO: Create a helper to toggle this from settings page
  sendVerificationEmail: false,
  lowercaseUsername: false,
  showAddRemoveServices: true,
  showForgotPasswordLink: true,
  showLabels: true,
  showPlaceholders: true,
  showResendVerificationEmailLink: false,
  continuousValidation: false,
  negativeFeedback: false,
  negativeValidation: true,
  positiveValidation: false,
  positiveFeedback: true,
  showValidating: true,
  onLogoutHook: function() {
    // return console.log('logout');
  },
  onSubmitHook: function() {
    // return console.log('submitting form');
  }
});


// rearranging the fields on Sign-Up, so that username comes first.
var passwordField = AccountsTemplates.removeField('password');

AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
      _id: "username",
      type: "text",
      displayName: "username",
      required: true,
      minLength: 5,
  },
  {
      _id: 'email',
      type: 'email',
      required: true,
      displayName: "email",
      re: /.+@(.+){2,}\.(.+){2,}/,
      errStr: 'Invalid email',
  },
  {
      _id: 'username_and_email',
      type: 'text',
      required: true,
      displayName: "Login",
      placeholder: "Username or Email",
  },
  passwordField
]);

AccountsTemplates.configureRoute('signIn', {
  layoutTemplate: 'homeLayout'
});

AccountsTemplates.configureRoute('signUp', {
  layoutTemplate: 'homeLayout',
  redirect: '/dashboard'
});

AccountsTemplates.configureRoute('forgotPwd', {
  layoutTemplate: 'homeLayout',
  name: 'forgotPwd'
});
