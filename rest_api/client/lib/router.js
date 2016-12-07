import { FlowRouter } from 'meteor/kadira:flow-router';

FlowRouter.route('/rest-api/v1/*', {
  name: 'rest-api',
  action () {
    // TODO: find out how to pass through to json-routes
  },
});
