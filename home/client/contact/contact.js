// Meteor packages imports
import { Template } from 'meteor/templating';

// APINF imports
import ContactFormSchema from '../../contactFormSchema';

Template.contactForm.helpers({
  contactFormSchema () {
    return ContactFormSchema;
  },
});
