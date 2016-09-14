import { Meteor } from 'meteor/meteor';
import { Settings } from '/settings/collection';
import { ContactFormSchema } from '../contactFormSchema';

Meteor.methods({
  sendEmail (doc) {
    // Important server-side check for security and data integrity
    check(doc, ContactFormSchema);

    // Build the e-mail text
    const text = 'Name: ' + doc.name + '\n\n'
    + 'Email: ' + doc.email + '\n\n\n\n'
    + doc.message;

    this.unblock();

    // Get email settings
    const mailSettings = Settings.findOne().mail;

    // Send the e-mail
    Email.send({
      to: mailSettings.toEmail,
      from: doc.email,
      subject: 'Apinf Contact Form - Message From ' + doc.name,
      text,
    });
  },
});
