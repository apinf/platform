/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Node packages imports
import slugs from 'limax';

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

    const apiName = api.name;

    // Transliterates non-Latin scripts
    const slug = slugs(apiName, { tone: false });

    // Look for existing duplicate slug beginning of the newest one
    const existingApi = Apis.findOne(
      {
        $or: [
          { 'friendlySlugs.slug.base': slug },
          { slug },
        ],
      },
      { sort: { 'friendlySlugs.slug.index': -1 } }
    );

    // Initialize index value 0
    let index = 0;
    let newSlug = slug;
    let slugBase = slug;

    // If duplicate slug exists
    if (existingApi && existingApi.friendlySlugs) {
      // Return existing slug if organization name exists
      if (api._id === existingApi._id
        && slug === existingApi.friendlySlugs.slug.base) {
        return api.slug;
      }
      // Set new index value
      index = existingApi.friendlySlugs.slug.index + 1;

      // Get base slug value
      slugBase = existingApi.friendlySlugs.slug.base;

      // Create new slug
      newSlug = `${slugBase}-${index}`;
    } else if (existingApi && existingApi.slug) {
      // Set new index value
      index += 1;

      // Create new slug
      newSlug = `${slugBase}-${index}`;
    }

    // Update new slug
    Apis.update({ name: apiName }, {
      $set: {
        slug: newSlug,
        'friendlySlugs.slug.base': slugBase,
        'friendlySlugs.slug.index': index,
      },
    });

    // Return the API slug
    return newSlug;
  },
});
