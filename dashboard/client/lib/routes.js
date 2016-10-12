import { Router } from 'meteor/iron:router';

Router.route('/dashboard', {
  name: 'dashboard',
  layout: 'masterLayout',
  template: 'dashboard',
});
