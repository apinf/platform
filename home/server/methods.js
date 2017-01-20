import { check } from 'meteor/check';
import { Email } from 'meteor/email';
import { Meteor } from 'meteor/meteor';
import { Settings } from '/settings/collection';
import ContactFormSchema from '../contactFormSchema';
import { Apis } from '/apis/collection';
import { Organizations } from '/organizations/collection';
//import  users  from '/users/collection';

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

Meteor.publish('apis_Count', function() {
 Counts.publish(this, 'apiscounts', Apis.find());
 });

 Meteor.publish('organizations_Count', function() {
  Counts.publish(this, 'organizationscounts', Organizations.find());
});

Meteor.publish('users_Count', function() {
 Counts.publish(this, 'userscounts', Meteor.users.find() );
 });
