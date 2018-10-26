/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Node packages imports 
import slugs from 'limax'; 
 
// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { DocHead } from 'meteor/kadira:dochead';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

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

FlowRouter.route('/organizations/:orgSlug/', {
  name: 'organizationProfile',
  action (params) {
    // Get organization slug
    const slug = params.orgSlug;

    // Get Organization
    Meteor.call('getOrganizationProfile', slug, (error, organizationProfile) => {
      // Check if Organization exists
      if (organizationProfile) {
 
        // Transliterates special characters in Organization name 
        let nameSlug; 
        if (organizationProfile.name) { 
          nameSlug = slugs(organizationProfile.name, { tone: false }); 
        } 
        
        // Add RSS Link
        DocHead.addLink({
          rel: 'alternate',
          type: 'application/rss+xml',
          href: `/rss/organizations/?slug=${slug}`,
          title: `RSS Feed for ${nameSlug}`,
        });

        // Set Social Meta Tags
        // Facebook & LinkedIn
        DocHead.addMeta({ property: 'og:image', content: organizationProfile.logoUrl });
        DocHead.addMeta({ property: 'og:title', content: nameSlug });
        DocHead.addMeta({ property: 'og:url', content: window.location.href });
        // Twitter
        DocHead.addMeta({ property: 'twitter:card', content: 'summary' });
        DocHead.addMeta({ property: 'twitter:title', content: nameSlug });
        DocHead.addMeta({ property: 'twitter:image', content: organizationProfile.logoUrl });

        BlazeLayout.render('masterLayout', { main: 'organizationProfile' });
      } else {
        // If Organization doesn't exist, show 'Not Found'
        FlowRouter.go('notFound');
      }
    });
  },
});

FlowRouter.route('/email-verify/:token/:slug', {
  name: 'email-verification',
  action (params) {
    // Get token from Router params
    const token = params.token;
    const slug = params.slug;
    // Update verification status
    Meteor.call('verifyToken', token, (error) => {
      if (error) {
        // Show token invalid
        sAlert.error(error.error, { timeout: 'none' });
      } else {
        // Email successfully verified
        sAlert.success(TAPi18n.__('emailVerification_successMessage'));
      }
    });
    // Go to front page
    FlowRouter.go('organizationProfile', { orgSlug: slug });
  },
});
