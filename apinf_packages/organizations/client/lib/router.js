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

FlowRouter.route('/organizations', {
  // Get query parameters for Catalog page on Enter
  triggersEnter: [function (context) {
    if (!context.queryParams.sortBy) {
      // Set query parameter if it doesn't exist
      context.queryParams.sortBy = 'name';
    }
    if (!context.queryParams.sortDirection) {
      // Set query parameter if it doesn't exist
      context.queryParams.sortDirection = 'ascending';
    }
    if (!context.queryParams.viewMode) {
      // Set query parameter if it doesn't exist
      context.queryParams.viewMode = 'grid';
    }
    // filterBy parameter must be available only for registered users
    if (!context.queryParams.filterBy && Meteor.userId()) {
      // Set query parameter if it doesn't exist
      context.queryParams.filterBy = 'all';
    }
  }],
  name: 'organizationCatalog',
  action () {
    BlazeLayout.render('masterLayout', { main: 'organizationCatalog' });
  },
});

FlowRouter.route('/organizations/:slug/', {
  name: 'organizationProfile',
  action (params) {
    // Get organization slug
    const slug = params.slug;

    // Get Organization
    Meteor.call('getOrganizationProfile', slug, (error, organizationProfile) => {
      // Check if Organization exists
      if (organizationProfile) {

        // Add RSS Link
        var linkInfo = {rel: "alternate", type: "application/rss+xml", href: `/rss/organizations/?slug=${slug}`, title: `RSS Feed for ${organizationProfile.name}` };
        DocHead.addLink(linkInfo);

        // Set Social Meta Tags
        // Facebook & LinkedIn
        DocHead.addMeta({ property: 'og:image', content: organizationProfile.logoUrl });
        DocHead.addMeta({ property: 'og:title', content: organizationProfile.name });
        DocHead.addMeta({ property: 'og:url', content: window.location.href });
        // Twitter
        DocHead.addMeta({ property: 'twitter:card', content: 'summary' });
        DocHead.addMeta({ property: 'twitter:title', content: organizationProfile.name });
        DocHead.addMeta({ property: 'twitter:image', content: organizationProfile.logoUrl });

        BlazeLayout.render('masterLayout', { main: 'organizationProfile' });
      } else {
        // If Organization doesn't exist, show 'Not Found'
        FlowRouter.go('notFound');
      }
    });
  },
});
