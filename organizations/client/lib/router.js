import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/organizations', {
  name: 'organizationCatalog',
  action () {
    BlazeLayout.render('masterLayout', { main: 'organizationCatalog' });
  },
});

FlowRouter.route('/organization/new', {
  name: 'addOrganization',
  action () {
    BlazeLayout.render('masterLayout', { main: 'addOrganization' });
  },
});

FlowRouter.route('/organization/:slug', {
  name: 'organizationProfile',
  action () {
    BlazeLayout.render('masterLayout', { main: 'organizationProfile' });
  },
});
