/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import Apis from '/apinf_packages/apis/collection';

Meteor.methods({
  getApiBySlug (slug) {
    // Make sure slug is a string
    check(slug, String);

    // Look for API
    const api = Apis.findOne({ slug });

    // Make sure API item exists
    if (api) {
      // Attach logo url
      api.logoUrl = api.logoUrl();
    }

    // Return the API
    return api;
  },
  updateApiBySlug (query) {
    // Make sure query is a object
    check(query, Object);
    const api = Apis.findOne(query);
    if (!api) {
      // Throw API error for client
      throw new Meteor.Error(`The API doesn't exists with parameter ${query}`);
    }

    // Get formed slug
    const slugFormed = Meteor.call('formSlugFromName', 'Apis', api.name);

    // If formed slug true
    if (slugFormed && typeof slugFormed === 'object') {
      // Update new slug
      Apis.update({ name: api.name }, {
        $set: {
          slug: slugFormed.slug,
          'friendlySlugs.slug.base': slugFormed.friendlySlugs.slug.base,
          'friendlySlugs.slug.index': slugFormed.friendlySlugs.slug.index,
        },
      });

      // Return the API slug
      return slugFormed.slug;
    }

    // Return
    return slugFormed;
  },
});
