import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/settings/proxies', {
  name: 'proxies',
  action () {
    BlazeLayout.render('masterLayout', { main: 'proxies' });
  },
});
