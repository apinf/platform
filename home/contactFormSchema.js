import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

const ContactFormSchema = new SimpleSchema({
  name: {
    type: String,
    max: 50,
    optional: false,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: false,
  },
  message: {
    type: String,
    max: 1000,
    optional: false,
    autoform: {
      rows: 5,
    },
  },
});

// Enable translations (i18n)
ContactFormSchema.i18n('schemas.contactForm');

export default ContactFormSchema;
