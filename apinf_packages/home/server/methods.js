/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Node packages imports
import slugs from 'limax';

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Email } from 'meteor/email';
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Organizations from '/apinf_packages/organizations/collection';
import Settings from '/apinf_packages/settings/collection';
import ContactFormSchema from '../contactFormSchema';

const Collections = {
  Apis,
  Organizations,
};

Meteor.methods({
  sendContactFormEmail (doc) {
    // Important server-side check for security and data integrity
    check(doc, ContactFormSchema);

    // Build the e-mail text
    const text = `Name: ${doc.name}

Email: ${doc.email}

${doc.message}`;

    this.unblock();

    // Get settings
    const settings = Settings.findOne();

    // Check if email settings are configured
    if (settings.mail && settings.mail.enabled) {
      // Send the e-mail
      Email.send({
        to: settings.mail.toEmail,
        from: settings.mail.fromEmail,
        subject: `Contact Form - message from ${doc.name}`,
        text,
      });
    }
  },
  formSlugFromName (collectionName, name) {
    // Make sure collectionName is a string
    check(collectionName, String);
    // Make sure name is a string
    check(name, String);
    // Get result
    const result = Collections[collectionName].findOne({ name });
    // Transliterates non-Latin scripts
    const slug = slugs(name, { tone: false });

    // Look for existing duplicate slug beginning of the newest one
    const duplicateSlug = Collections[collectionName].findOne(
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
    if (duplicateSlug && duplicateSlug.friendlySlugs) {
      // Return false, this block only execute in case of update slug
      if (result && result._id === duplicateSlug._id
        && slug === duplicateSlug.friendlySlugs.slug.base) {
        // Return old slug
        return result.slug;
      }
      // Set new index value
      index = duplicateSlug.friendlySlugs.slug.index + 1;

      // Get base slug value
      slugBase = duplicateSlug.friendlySlugs.slug.base;

      // Create new slug
      newSlug = `${slugBase}-${index}`;
    } else if (duplicateSlug && duplicateSlug.slug) {
      // Set new index value
      index += 1;

      // Create new slug
      newSlug = `${slugBase}-${index}`;
    }

    // Return slug and friendly slug value inside object
    return {
      slug: newSlug,
      friendlySlugs: {
        slug: {
          base: slugBase,
          index,
        },
      },
    };
  },
});
// eslint-disable-next-line prefer-arrow-callback
Meteor.publish('apisCount', function () {
  // Get CurrentUser
  const userId = Meteor.userId();
  let query = {};

  // Check if currentUser is administrator
  const isAdmin = Roles.userIsInRole(userId, ['admin']);

  if (!isAdmin) {
    // Construct query for checking if API is public or current user is authorized for the API
    query = {
      $or: [
        {
          isPublic: true,
        },
        {
          authorizedUserIds: {
            $in: [userId],
          },
        },
        {
          managerIds: {
            $in: [userId],
          },
        },
      ],
    };
  }

  Counts.publish(this, 'apisCount', Apis.find(query));
});

Meteor.publish('organizationsCount', function () {
  Counts.publish(this, 'organizationsCount', Organizations.find());
});

Meteor.publish('usersCount', function () {
  Counts.publish(this, 'usersCount', Meteor.users.find());
});
