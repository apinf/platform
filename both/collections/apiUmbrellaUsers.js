ApiUmbrellaUsers = new Mongo.Collection('apiUmbrellaUsers');

ApiUmbrellaUsersSchema = new SimpleSchema({
  id: {
    type: String,
    optional: true
  },
  api_key: {
    type: String,
    optional: true
  },
  created_at: {
    type: Date,
    optional: true
  },
  first_name: {
    type: String,
    optional: true
  },
  last_name: {
    type: String,
    optional: true
  },
  email: {
    type: String,
    optional: true
  },
  email_verified: {
    type: Boolean,
    optional: true
  },
  website: {
    type: String,
    optional: true
  },
  registration_source: {
    type: String,
    optional: true
  },
  throttle_by_ip: {
    type: Boolean,
    optional: true
  },
  disabled_at: {
    type: Date,
    optional: true
  },
  roles: {
    type: [String],
    optional: true
  },
  userId: {
    type: String,
    label: 'User',
    optional: true,
    autoform: {
      options: function() {
        // Get all Meteor users as array
        var users = Meteor.users.find().fetch();
        // Create an array of label value pairs for autoform select
        return _.map(users, function(user) {
          return {
            label: user.emails[0].address,
            value: user._id
          };
        });
      }
    }
  }
});

ApiUmbrellaUsers.attachSchema(ApiUmbrellaUsersSchema);
