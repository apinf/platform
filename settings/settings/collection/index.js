Settings = new Mongo.Collection('Settings');

SimpleSchema.messages({
  regEx: [
    {exp: SimpleSchema.RegEx.Url, msg: "[label] must be a valid URL"},
  ]
});

Schemas.SettingsSchema = new SimpleSchema({
  apinf: {
    type: Object,
    optional: true
  },
  apiDocumentationEditor: {
    type: Object,
    optional: true
  },
  "apiDocumentationEditor.enabled": {
    type: Boolean,
    optional: true
  },
  "apiDocumentationEditor.host": {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: "Host",
    optional: true,
    autoform: {
      placeholder: 'http://editor.example.com/'
    },
    custom: function () {
      let apiDocumentationEditorEnabled = this.field("apiDocumentationEditor.enabled").value;
      let apiDocumentationEditorHost = this.value;

      // Require editor host if apiDocumentationEditor.enabled is checked
      if (apiDocumentationEditorEnabled === true && !apiDocumentationEditorHost) {
        return "required";
      }
    }
  },
  mail: {
    type: Object,
    optional: true
  },
  "mail.enabled": {
    type: Boolean,
    optional: true
  },
  "mail.username": {
    type: String,
    label: "Mailgun Username",
    optional: true,
    autoform: {
      placeholder: 'Mailgun Username'
    },
    custom: function () {
      let mailEnabled = this.field("mail.enabled").value;
      let mailUsername = this.value;

      // Require mail username if mailEnabled is checked
      if (mailEnabled === true && !mailUsername) {
        return "required";
      }
    }
  },
  "mail.password": {
    type: String,
    label: "Mailgun Password",
    optional: true,
    autoform: {
      placeholder: 'xxx'
    },
    custom: function () {
      let mailEnabled = this.field("mail.enabled").value;
      let mailPassword = this.value;

      // Require mail password if mail enabled is checked
      if (mailEnabled === true && !mailPassword) {
        return "required";
      }
    }
  },
  "mail.toEmail": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: "Contact Form E-mail Address",
    optional: true,
    autoform: {
      placeholder: 'mail@example.com'
    },
    custom: function () {
      let mailEnabled = this.field("mail.enabled").value;
      let contactFormEmail = this.value;

      // Require mail password if mail enabled is checked
      if (mailEnabled === true && !contactFormEmail) {
        return "required";
      }
    }
  },
  githubConfiguration: {
    type: Object,
    optional: true
  },
  "githubConfiguration.clientId": {
    type: String,
    label: "Client ID",
    optional: true,
    autoform: {
      placeholder: 'xxx'
    }
  },
  "githubConfiguration.secret": {
    type: String,
    label: "Secret",
    optional: true,
    autoform: {
      placeholder: 'xxx'
    }
  },
  initialSetupComplete: {
    type: Boolean,
    optional: true
  }
});

Settings.attachSchema(Schemas.SettingsSchema);
