import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/organization/new', {
  name: 'addOrganization',
  action () {
    BlazeLayout.render('masterLayout', { main: 'addOrganization' });
  },
});

FlowRouter.route('/organizations/:slug', {
  name: 'singleOrganization',
  action () {
    BlazeLayout.render('masterLayout', { main: 'singleOrganization' });
  },
});
