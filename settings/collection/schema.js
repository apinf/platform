import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';
import { Settings } from './';

Settings.schema = new SimpleSchema({
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
    label: TAPi18n.__('settings_mail_username_label'),
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
    label: TAPi18n.__('settings_mail_password_label'),
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
    label: TAPi18n.__('settings_mail_smtpHost_label'),
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
    label: TAPi18n.__('settings_mail_smtpPort_label'),
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
    label: TAPi18n.__('settings_mail_fromEmail_label'),
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
    label: TAPi18n.__('settings_mail_toEmail_label'),
    optional: true,
  },
  githubConfiguration: {
    type: Object,
    optional: true,
  },
  'githubConfiguration.clientId': {
    type: String,
    label: 'Client ID',
    optional: true,
    autoform: {
      placeholder: 'xxx',
    },
  },
  'githubConfiguration.secret': {
    type: String,
    label: 'Secret',
    optional: true,
    autoform: {
      placeholder: 'xxx',
    },
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
});

// Enable translations (i18n)
Settings.schema.i18n('schemas.settings');

Settings.attachSchema(Settings.schema);
