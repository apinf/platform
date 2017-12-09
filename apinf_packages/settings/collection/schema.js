/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import Settings from './';

Settings.schema = new SimpleSchema({
  access: {
    type: Object,
    optional: true,
  },
  'access.onlyAdminsCanAddApis': {
    type: Boolean,
    optional: true,
  },
  'access.onlyAdminsCanAddOrganizations': {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
  apiDocumentationEditor: {
    type: Object,
    optional: true,
  },
  'apiDocumentationEditor.enabled': {
    type: Boolean,
    optional: true,
  },
  'apiDocumentationEditor.host': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    autoform: {
      placeholder: 'http://editor.example.com/',
    },
    custom () {
      const apiDocumentationEditorEnabled = this.field('apiDocumentationEditor.enabled').value;
      const apiDocumentationEditorHost = this.value;
      let validation;
      // Require editor host if apiDocumentationEditor.enabled is checked
      if (apiDocumentationEditorEnabled === true && !apiDocumentationEditorHost) {
        validation = 'required';
      }
      return validation;
    },
  },
  mail: {
    type: Object,
    optional: true,
  },
  'mail.enabled': {
    type: Boolean,
    optional: true,
  },
  'mail.username': {
    type: String,
    optional: true,
    custom () {
      const mailEnabled = this.field('mail.enabled').value;
      const mailUsername = this.value;
      let validation;
      // Require mail username if mailEnabled is checked
      if (mailEnabled === true && !mailUsername) {
        validation = 'required';
      }
      return validation;
    },
  },
  'mail.password': {
    type: String,
    optional: true,
    custom () {
      const mailEnabled = this.field('mail.enabled').value;
      const mailPassword = this.value;
      let validation;
      // Require mail password if mail enabled is checked
      if (mailEnabled === true && !mailPassword) {
        validation = 'required';
      }
      return validation;
    },
  },
  'mail.smtpHost': {
    type: String,
    regEx: SimpleSchema.RegEx.Domain,
    optional: true,
    custom () {
      const mailEnabled = this.field('mail.enabled').value;
      const smtpHost = this.value;
      let validation;

      // Require SMTP Host if mail enabled is checked
      if (mailEnabled === true && !smtpHost) {
        validation = 'required';
      }
      return validation;
    },
  },
  'mail.smtpPort': {
    type: Number,
    optional: true,
    custom () {
      const mailEnabled = this.field('mail.enabled').value;
      const smtpPort = this.value;
      let validation;
      // Require SMTP Port if mail enabled is checked
      if (mailEnabled === true && !smtpPort) {
        validation = 'required';
      }
      return validation;
    },
  },
  'mail.fromEmail': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
    custom () {
      const mailEnabled = this.field('mail.enabled').value;
      const fromEmail = this.value;
      let validation;
      // Require SMTP Port if mail enabled is checked
      if (mailEnabled === true && !fromEmail) {
        validation = 'required';
      }
      return validation;
    },
  },
  'mail.toEmail': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
  },
  sdkCodeGenerator: {
    type: Object,
    optional: true,
  },
  'sdkCodeGenerator.enabled': {
    type: Boolean,
    optional: true,
  },
  'sdkCodeGenerator.host': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    autoform: {
      placeholder: 'https://generator.example.com/',
    },
    custom () {
      const sdkCodeGeneratorEnabled = this.field('sdkCodeGenerator.enabled').value;
      const sdkCodeGeneratorHost = this.value;
      let validation;
      // Require code generator host if sdkCodeGenerator.enabled is checked
      if (sdkCodeGeneratorEnabled === true && !sdkCodeGeneratorHost) {
        validation = 'required';
      }
      return validation;
    },
  },
  pageReloadTime: {
    type: Number,
    optional: true,
    defaultValue: 10,
  }
});

// Enable translations (i18n)
Settings.schema.i18n('schemas.settings');

Settings.attachSchema(Settings.schema);
