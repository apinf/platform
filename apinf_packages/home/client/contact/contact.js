/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// APInf imports
import '/apinf_packages/home/client/contact/contact.html';
import ContactFormSchema from '../../contactFormSchema';

Template.contactForm.helpers({
  contactFormSchema () {
    return ContactFormSchema;
  },
});
