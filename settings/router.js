Router.route('/settings/profile', {
  name: 'settings.profile',
  layout: 'masterLayout',
  template: 'profile'
});

Router.route('/settings/account', {
  name: 'settings.account',
  layout: 'masterLayout',
  template: 'account'
});

Router.route('/settings', {
  name: 'settings',
  layout: 'masterLayout',
  template: 'settings'
});

Router.route('/settings/branding', {
  name: 'settings.branding',
  layout: 'masterLayout',
  template: 'branding'
});

Router.route('/settings/proxies', {
  name: 'settings.proxies',
  layout: 'masterLayout',
  template: 'proxies'
});
