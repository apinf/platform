Settings = new Mongo.Collection('Settings');

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
    label: "Enable apiDocumentation Editor",
    optional:true
  },
  "apiDocumentationEditor.host": {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: "Host",
    optional: true, // Optional must be true for custom validation
    custom: function () { // Custom validator logic
      // get the value of apiDocumentationEditor.enabled field
      let enabledFieldValue = this.field("apiDocumentationEditor.enabled").value;
      // if enabled is true, host field is required
      if (enabledFieldValue === true) {
        return "required"; // host field is required
      }
    }
  },
  apiUmbrella: {
    type: Object,
    optional: true
  },
  "apiUmbrella.host": {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: "Host",
    optional: true,
    autoform: {
      placeholder: 'https://example.com/'
    }
  },
  "apiUmbrella.apiKey": {
    type: String,
    label: "API Key",
    optional: true,
    autoform: {
      placeholder: 'xxx'
    }
  },
  "apiUmbrella.authToken": {
    type: String,
    label: "Auth Token",
    optional: true,
    autoform: {
      placeholder: 'xxx'
    }
  },
  "apiUmbrella.baseUrl": {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: "Base URL",
    optional: true,
    autoform: {
      placeholder: 'https://example.com/api-umbrella/'
    }
  },
  elasticsearch: {
    type: Object,
    optional: true
  },
  "elasticsearch.host": {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: "Host",
    optional: true,
    autoform: {
      placeholder: 'http://example.com:14002/'
    }
  },
  email:{
    type: Object,
    optional:true
  },
  "email.enabled": {
    type: Boolean,
    optional:true
  },
  "email.sitename": {
    type: String,
    label: "Name of the Site",
    optional: true
  },
  "email.domain": {
    type: String,
    label: "Domain of the site",
    optional: true,
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
      var mailEnabled = this.field("mail.enabled").value;
      if (mailEnabled === true) {
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
      var mailEnabled = this.field("mail.enabled").value;
      if (mailEnabled === true) {
        return "required";
      }
    }
  },
  "socialMedia": {
    type: Object,
    optional:true
  },
  "socialMedia.enabled": {
    type: Boolean,
    optional:true
  },
  "socialMedia.facebook": {
    type: Object,
    optional: true,
  },
  "socialMedia.facebook.url": {
    type: String,
    label: "Facebook URL",
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  "socialMedia.facebook.icon": {
    type: String,
    optional: true,
  },
  "socialMedia.twitter": {
    type: Object,
    optional: true,
  },
  "socialMedia.twitter.url": {
    type: String,
    label: "Twitter URL",
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  "socialMedia.twitter.icon": {
    type: String,
    optional: true,
  },
  "socialMedia.github": {
    type: Object,
    optional: true,
  },
  "socialMedia.github.url": {
    type: String,
    label: "Github URL",
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  "socialMedia.github.icon": {
    type: String,
    optional: true,
  },
  "socialMedia.info": {
    type: Object,
    optional: true,
  },
  "socialMedia.info.url": {
    type: String,
    label: "Info URL",
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  "socialMedia.info.icon": {
    type: String,
    optional: true,
  },
  contactForm: {
    type: Object,
    optional: true
  },
  "contactForm.toEmail": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: "Contact Form E-mail Address",
    optional: true,
    autoform: {
      placeholder: 'mail@example.com'
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
  }
});

Settings.attachSchema(Schemas.SettingsSchema);

Meteor.startup(function () {

  Settings.allow({
    insert: function() {
      // get settings
      var dbSettingsCount = Settings.find().count();
      // if no settings exist
      if ( dbSettingsCount > 0 ) {
        // don't allow insert
        return false;
      } else {
        // insert
        return true;
      }
    },
    update: function() {
      return true;
    }

  });

});
