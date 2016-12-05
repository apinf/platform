// User accounts guide
// https://github.com/meteor-useraccounts/core/blob/master/Guide.md
AccountsTemplates.configure({
  /* Route configuration */
  defaultLayout: 'masterLayout',
  defaultContentRegion: 'main',
  /* Behavior */
  confirmPassword: true,
  enablePasswordChange: true,
  forbidClientAccountCreation: false,
  overrideLoginErrors: true,
  lowercaseUsername: false,
  sendVerificationEmail: true,
  /* Appearance */
  showAddRemoveServices: true,
  showForgotPasswordLink: true,
  showLabels: true,
  showPlaceholders: true,
  showResendVerificationEmailLink: true,
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

// Sign in
AccountsTemplates.configureRoute('signIn', {
  layoutType: 'blaze',
  name: 'signIn',
  path: '/sign-in',
  layoutTemplate: 'masterLayout',
  contentRegion: 'main',
});

// Sign up
AccountsTemplates.configureRoute('signUp', {
  layoutType: 'blaze',
  name: 'signUp',
  path: '/sign-up',
  layoutTemplate: 'masterLayout',
  contentRegion: 'main',
});
