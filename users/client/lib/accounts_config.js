// User accounts guide
// https://github.com/meteor-useraccounts/core/blob/master/Guide.md
AccountsTemplates.configure({
  /* Behavior */
  confirmPassword: true,
  enablePasswordChange: true,
  forbidClientAccountCreation: false,
  overrideLoginErrors: true,
  lowercaseUsername: false,
  sendVerificationEmail: true,
  /* Appearance */
  showAddRemoveServices: true,
  showForgotPasswordLink: false,
  showLabels: true,
  showPlaceholders: true,
  showResendVerificationEmailLink: false,
  /* Client-side validation */
  continuousValidation: false,
  negativeFeedback: false,
  negativeValidation: true,
  positiveValidation: false,
  positiveFeedback: true,
  showValidating: true,
});

// rearranging the fields on Sign-Up, so that username comes first.
const passwordField = AccountsTemplates.removeField('password');

AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
    _id: 'username',
    type: 'text',
    displayName: 'username',
    required: true,
    minLength: 5,
  },
  {
    _id: 'email',
    type: 'email',
    required: true,
    displayName: 'email',
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: 'Invalid email',
  },
  {
    _id: 'username_and_email',
    type: 'text',
    required: true,
    displayName: 'Login',
    placeholder: 'Username or Email',
  },
  passwordField,
]);

AccountsTemplates.configureRoute('signIn', {
  layoutTemplate: 'masterLayout',
});

AccountsTemplates.configureRoute('signUp', {
  layoutTemplate: 'masterLayout',
});
