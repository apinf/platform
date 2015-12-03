Settings = new Mongo.Collection('Settings');

Schemas.SettingsSchema = new SimpleSchema({
  apinf: {
    type: Object,
    optional: true
  },
  "apinf.host": {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: "Host",
    optional: true,
    autoform: {
      placeholder: 'https://example.com/'
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
  mail: {
    type: Object,
    optional: true
  },
  "mail.username": {
    type: String,
    label: "Mailgun Username",
    optional: true,
    autoform: {
      placeholder: 'Mailgun Username'
    }
  },
  "mail.password": {
    type: String,
    label: "Mailgun Password",
    optional: true,
    autoform: {
      placeholder: 'xxx'
    }
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
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    }
  });
});
