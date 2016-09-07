import { ContactFormSchema } from '../../contactFormSchema';

Template.contactForm.helpers({
  contactFormSchema: function() {
    return ContactFormSchema;
  }
});
