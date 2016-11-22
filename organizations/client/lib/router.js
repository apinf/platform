import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/organization/:slug', {
  name: 'singleOrganization',
  action (params) {
    BlazeLayout.render('mainLayout', {
      main: 'singleOrganization',
    });
  },
});
