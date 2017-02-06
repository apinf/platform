import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
  name: 'home',
  action: function () {
    BlazeLayout.render('masterLayout', { main: 'home' });
  },
});
