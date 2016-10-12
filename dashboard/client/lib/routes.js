import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

Router.route('/dashboard', {
  name: 'dashboard',
  layout: 'masterLayout',
  template: 'dashboard',
  action () {
    // Check user is logged in
    if (Meteor.user()) {
      this.next();
    } else {
      // If not redirect to sign in
      this.redirect('/sign-in');
      this.next();
    }
  },
});
