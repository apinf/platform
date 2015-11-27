Settings = new Mongo.Collection('Settings');

Schemas.SettingsSchema = new SimpleSchema({
  apinf_host: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: "Apinf host",
    optional: false,
    autoform: {
      placeholder: 'https://example.com/'
    }
  },
  api_umbrella_host: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: "Api Umbrella host",
    optional: false,
    autoform: {
      placeholder: 'https://example.com/'
    }
  },
  api_umbrella_api_key: {
    type: String,
    label: "Api Umbrella api key",
    optional: false,
    autoform: {
      placeholder: 'xxx'
    }
  },
  api_umbrella_auth_token: {
    type: String,
    label: "Api Umbrella auth token",
    optional: false,
    autoform: {
      placeholder: 'xxx'
    }
  },
  api_umbrella_base_url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: "Api Umbrella base url",
    optional: false,
    autoform: {
      placeholder: 'https://example.com/api-umbrella/'
    }
  },
  elasticsearch_host: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: "Elastic search host",
    optional: false,
    autoform: {
      placeholder: 'http://example.com:14002/'
    }
  },
  mailgun_username: {
    type: String,
    label: "Mailgun username",
    optional: false,
    autoform: {
      placeholder: 'Mailgun username'
    }
  },
  mailgun_password: {
    type: String,
    label: "Mailgun password",
    optional: false,
    autoform: {
      placeholder: 'xxx'
    }
  },
  contactForm_toEmail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: "Contact form e-mail address",
    optional: false,
    autoform: {
      placeholder: 'mail@example.com'
    }
  },
  githubConfiguration_clientId: {
    type: String,
    label: "Github client id",
    optional: false,
    autoform: {
      placeholder: 'xxx'
    }
  },
  githubConfiguration_secret: {
    type: String,
    label: "Github secret",
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
