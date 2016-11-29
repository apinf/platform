import { Router } from 'meteor/iron:router';

Router.route('/organization/new', function () {
  this.render('addOrganization');
  this.layout('masterLayout');
}, {
  name: 'addOrganization',
});
