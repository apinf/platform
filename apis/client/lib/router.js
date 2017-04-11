/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { DocHead } from 'meteor/kadira:dochead';

FlowRouter.route('/apis/new', {
  name: 'addApi',
  action () {
    BlazeLayout.render('masterLayout', { main: 'addApi' });
  },
});

FlowRouter.route('/apis/import', {
  name: 'importApiConfiguration',
  action () {
    BlazeLayout.render('masterLayout', { main: 'importApiConfiguration' });
  },
});

FlowRouter.route('/apis/:slug/', {
  name: 'viewApi',
  action (params) {
    // Get current API Backend ID
    const slug = params.slug;

    // Check if API exists
    Meteor.call('getApi', slug, (error, api) => {
      // Check if API exists
      if (api) {
        // Set Social Meta Tags
        // Facebook & LinkedIn
        DocHead.addMeta({ property: 'og:image', content: api.logoUrl });
        DocHead.addMeta({ property: 'og:title', content: api.name });
        DocHead.addMeta({ property: 'og:description', content: api.description });
        DocHead.addMeta({ property: 'og:url', content: window.location.href });
        // Twitter
        DocHead.addMeta({ property: 'twitter:card', content: 'summary' });
        DocHead.addMeta({ property: 'twitter:title', content: api.name });
        DocHead.addMeta({ property: 'twitter:description', content: api.description });
        DocHead.addMeta({ property: 'twitter:image', content: api.logoUrl });

        // Ensure current user has permissions to view backend
        Meteor.call('currentUserCanViewApi', slug, (canViewError, userCanViewApi) => {
          if (userCanViewApi) {
            BlazeLayout.render('masterLayout', { main: 'viewApi' });
          } else {
            // User is not allowed to view API
            FlowRouter.go('forbidden');
          }
        });
      } else {
        // If API doesn't exist, show 'Not Found'
        FlowRouter.go('notFound');
      }
    });
  },
});
