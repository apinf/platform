import { ContactFormSchema } from '../../contactFormSchema';

Template.contactForm.helpers({
  contactFormSchema () {
    return ContactFormSchema;
  },
});
