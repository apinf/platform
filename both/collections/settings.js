Settings = new Mongo.Collection('Settings');

Schemas.SettingsSchema = new SimpleSchema({
  apinf_host: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: "Host",
    optional: false,
    autoform: {
      placeholder: 'https://example.com/'
    }
  },
  api_umbrella_host: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: "Host",
    optional: false,
    autoform: {
      placeholder: 'https://example.com/'
    }
  },
  api_umbrella_api_key: {
    type: String,
    label: "API Key",
    optional: false,
    autoform: {
      placeholder: 'xxx'
    }
  },
  api_umbrella_auth_token: {
    type: String,
    label: "Auth Token",
    optional: false,
    autoform: {
      placeholder: 'xxx'
    }
  },
  api_umbrella_base_url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: "Base URL",
    optional: false,
    autoform: {
      placeholder: 'https://example.com/api-umbrella/'
    }
  },
  elasticsearch_host: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: "Host",
    optional: false,
    autoform: {
      placeholder: 'http://example.com:14002/'
    }
  },
  mailgun_username: {
    type: String,
    label: "Mailgun Username",
    optional: false,
    autoform: {
      placeholder: 'Mailgun Username'
    }
  },
  mailgun_password: {
    type: String,
    label: "Mailgun Password",
    optional: false,
    autoform: {
      placeholder: 'xxx'
    }
  },
  contactForm_toEmail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: "Contact Form E-mail Address",
    optional: false,
    autoform: {
      placeholder: 'mail@example.com'
    }
  },
  githubConfiguration_clientId: {
    type: String,
    label: "Client ID",
    optional: false,
    autoform: {
      placeholder: 'xxx'
    }
  },
  githubConfiguration_secret: {
    type: String,
    label: "Secret",
    optional: false,
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
