import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/organization/new', {
  name: 'addOrganization',
  action: function () {
    BlazeLayout.render('masterLayout', { main: 'addOrganization' });
  },
});
