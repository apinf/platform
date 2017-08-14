/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Email } from 'meteor/email';

// Collection imports
import Apis from '/packages/apis/collection';
import Organizations from '/packages/organizations/collection';
import Settings from '/packages/settings/collection';
import ContactFormSchema from '../contactFormSchema';

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
});
// eslint-disable-next-line prefer-arrow-callback
Meteor.publish('apisCount', function () {
  Counts.publish(this, 'apisCount', Apis.find());
});

Meteor.publish('organizationsCount', function () {
  Counts.publish(this, 'organizationsCount', Organizations.find());
});

Meteor.publish('usersCount', function () {
  Counts.publish(this, 'usersCount', Meteor.users.find());
});
