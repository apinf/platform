/* Copyright 2017 Apinf Oy.
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { RssFeed } from 'meteor/raix:rssfeed';

// Collection imports
import Apis from '/apis/collection';
import Organizations from '/organizations/collection';
import OrganizationApis from '../';

Organizations.find().forEach((organization) => {
  // Get organization slug
  const organizationSlug = organization.slug;

  // Call Rss feed publication
  // First argument (apis) will build the url for the feed i.e domain-name/rss/apis
  RssFeed.publish(organizationSlug, function () {
    // Initialize variable feed
    const feed = this;

    // Get organization name
    const organizationName = organization.name;

    // RSS header title
    feed.setValue('title', feed.cdata(`${organizationName} organization's News Feed`));

    // RSS header description
    feed.setValue('description', feed.cdata(`Apis that are connected to ${organizationName}.`));

    // RSS header link
    const meteorAbsoluteUrl = Meteor.absoluteUrl().slice(0, -1);
    feed.setValue('link', meteorAbsoluteUrl);

    // lastBuildDate: About RSS feed was last built with new information.
    feed.setValue('lastBuildDate', new Date());

    // pubDate: About RSS feed publish Date
    feed.setValue('pubDate', new Date());

    // ttl: The length of time (in minutes).
    // RSS channel can be cached
    // before refreshing from the source
    feed.setValue('ttl', 60);

    // Get the organizationId
    const organizationId = organization._id;

    // Iterate over all OrganizationApis of this organization
    OrganizationApis.find({ organizationId }).forEach((organizationApi) => {
      // Make a filter key for Apis schema
      const apiId = organizationApi.apiId;

      // Get api from apiOrganizationId
      const api = Apis.findOne(apiId);

      // Append an item to our feed using the .addItem() method
      feed.addItem({
        title: api.name,
        description: `${api.description}`,
        link: `${meteorAbsoluteUrl}/apis/${api.slug}`,
        pubDate: api.created_at,
      });
    });
  });
});
