/* Copyright 2017 APInf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { RssFeed } from 'meteor/raix:rssfeed';

// Collection imports
import Apis from '/imports/apis/collection';
import Organizations from '/packages/organizations/collection';
import OrganizationApis from '../';

// Create RSS feed publication
// First argument ('organizations') will build the baseurl
// 'query' argument should contain organization slug
RssFeed.publish('organizations', function (query) {
  // Initialize variable feed
  const feed = this;

  // Get document containg an organization collection
  const organization = Organizations.findOne({ slug: query.slug });

  // Make sure organization exists
  if (organization) {
    // Get organization name
    const organizationName = organization.name;

    // Variable for pubDate and buildDate
    const dateForPubBuild = new Date();

    // RSS header title
    feed.setValue('title', feed.cdata(`${organizationName} organization's News Feed`));

    // RSS header description
    feed.setValue('description', feed.cdata(`Apis that are connected to ${organizationName}.`));

    // RSS header link
    const meteorAbsoluteUrl = Meteor.absoluteUrl().slice(0, -1);
    feed.setValue('link', meteorAbsoluteUrl);

    // lastBuildDate: About RSS feed was last built with new information.
    feed.setValue('lastBuildDate', dateForPubBuild);

    // pubDate: About RSS feed publish Date
    feed.setValue('pubDate', dateForPubBuild);

    // ttl: The length of time (in minutes).
    // RSS channel can be cached before refreshing from the source
    feed.setValue('ttl', 60);

    // Get the organizationId
    const organizationId = organization._id;

    // Iterate over all OrganizationApis of this organization
    OrganizationApis.find({ organizationId }).forEach((organizationApi) => {
      // Get api from apiOrganizationId
      const api = Apis.findOne(organizationApi.apiId);

      // Append an item to our feed using the .addItem() method
      feed.addItem({
        title: api.name,
        description: `${api.description}`,
        link: `${meteorAbsoluteUrl}/apis/${api.slug}`,
        pubDate: api.created_at,
      });
    });
  }
});
