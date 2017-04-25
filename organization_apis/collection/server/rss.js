/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */
// importing RssFeed library
import { RssFeed } from 'meteor/raix:rssfeed';
// importing organizations schema
import Organizations from '/organizations/collection';
// importing api schema
import Apis from '/apis/collection';
// importing apis belong to organization schema
import OrganizationApis from '../';

Organizations.find().forEach((organization) => {
  // Use variable as in feed argument
  const organizationName = organization.slug;
 // calling Rss feed publication
 // first argument (apis) will build the url for the feed i.e domain-name/rss/apis
  RssFeed.publish(organizationName, function () {
  // initialization of variable feed
    const feed = this;
  // added RSS header information
  // lastBuildDate: About RSS feed was last built with new information.
  // pubDate: About RSS feed publish Date
  /* ttl: The length of time (in minutes) RSS channel can be cached
          before refreshing from the source*/
    feed.setValue('title', feed.cdata('Apinf organization\'s News Feed'));
    feed.setValue('description', feed.cdata('Apis that are connected to organizations.'));
    feed.setValue('link', 'https://apinf.io');
    feed.setValue('lastBuildDate', new Date());
    feed.setValue('pubDate', new Date());
    feed.setValue('ttl', 1);
   // Look at each entry of OrganizationApis shcema
    OrganizationApis.find().forEach((organizationApi) => {
      // make a filter key for Apis schema
      const apiOrganizationId = organizationApi.apiId;
      // create object from Apis schema according to apiorganizationId
      const api = Apis.findOne({ _id: apiOrganizationId });
      // make a filter key for Organization schema
      const OrganizationAPiId = organizationApi.organizationId;
      // Condition to check if organizationApiID and OrganizationsID match
      if (OrganizationAPiId === organization._id) {
      // append an item to our feed using the .addItem() method
        feed.addItem({
          title: api.name,
          description: `${api.description}`,
          link: `https://apinf.io/apis/${api.slug}`,
          pubDate: api.created_at,
        });
      }
    });
  });
});
