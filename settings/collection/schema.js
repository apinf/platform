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

      // Require editor host if apiDocumentationEditor.enabled is checked
      if (apiDocumentationEditorEnabled === true && !apiDocumentationEditorHost) {
        return 'required';
      }
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
    label: 'Username',
    optional: true,
    custom () {
      const mailEnabled = this.field('mail.enabled').value;
      const mailUsername = this.value;

      // Require mail username if mailEnabled is checked
      if (mailEnabled === true && !mailUsername) {
        return 'required';
      }
    },
  },
  'mail.password': {
    type: String,
    label: 'Password',
    optional: true,
    custom () {
      const mailEnabled = this.field('mail.enabled').value;
      const mailPassword = this.value;

      // Require mail password if mail enabled is checked
      if (mailEnabled === true && !mailPassword) {
        return 'required';
      }
    },
  },
  'mail.smtpHost': {
    type: String,
    label: 'SMTP Host',
    regEx: SimpleSchema.RegEx.Domain,
    optional: true,
    custom () {
      const mailEnabled = this.field('mail.enabled').value;
      const smtpHost = this.value;

      // Require SMTP Host if mail enabled is checked
      if (mailEnabled === true && !smtpHost) {
        return 'required';
      }
    },
  },
  'mail.smtpPort': {
    type: Number,
    label: 'SMTP Port',
    optional: true,
    custom () {
      const mailEnabled = this.field('mail.enabled').value;
      const smtpPort = this.value;

      // Require SMTP Port if mail enabled is checked
      if (mailEnabled === true && !smtpPort) {
        return 'required';
      }
    },
  },
  'mail.toEmail': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: 'Contact Form E-mail Address',
    optional: true
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

      // Require code generator host if sdkCodeGenerator.enabled is checked
      if (sdkCodeGeneratorEnabled === true && !sdkCodeGeneratorHost) {
        return 'required';
      }
    },
  },
});

// Enable translations (i18n)
Settings.schema.i18n('schemas.settings');

Settings.attachSchema(Settings.schema);
