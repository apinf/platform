FlowRouter.route('/organization/:slug', {
  name: 'singleOrganization',
  action (params) {
    BlazeLayout.render('mainLayout', {
      main: 'singleOrganization',
    });
  },
});
