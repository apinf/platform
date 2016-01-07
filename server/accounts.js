Accounts.onCreateUser(function(options, user) {
  // Initialize API Umbrella related variables
  var apiUmbrellaUserObj, response;

  // Create empty user profile if none exists
  user.profile = user.profile || {};

  // Check for Github authentication
  if (user.services && user.services.github) {
    // Set user email address from Github email
    user.emails = [
      {
        address: user.services.github.email,
        verified: true
      }
    ];

    // Set username from Github username
    user.username = user.services.github.username;
  }

  // It doesn't allow to create a user on APIUmbrella side if apiUmbrellaWeb is not created
  // TODO: show an error message to inform user about it
  if ( typeof apiUmbrellaWeb !== 'undefined' ) {
    // Create API Umbrella user object with required fields
    apiUmbrellaUserObj = {
      "user": {
        "email": user.emails[0].address,
        "first_name": "-",
        "last_name": "-",
        "terms_and_conditions": true
      }
    };

    // Add user on API Umbrella
    response = apiUmbrellaWeb.adminApi.v1.apiUsers.createUser(apiUmbrellaUserObj);

    // Add API Umbrella User ID to Apinf user
    user.apiUmbrellaUserId = response.data.user.id;

    // Add API Umbrella User API Key to Apinf user
    user.profile.apiKey = response.data.user.api_key;

    // Insert full API Umbrella user object into API Umbrella Users collection
    ApiUmbrellaUsers.insert(response.data.user);
  }

  return user;
});

Accounts.onLogin(function(info) {
  var e, email, github, ref, result, user;
  user = info.user;
  var userId = user._id;

  if ((ref = user.services) != null ? ref.github : void 0) {
    if (user) {
      github = new GitHub({
        version: '3.0.0',
        timeout: 5000
      });
      github.authenticate({
        type: 'oauth',
        token: user.services.github.accessToken
      });
      try {
        result = github.user.getEmails({
          user: user.services.github.username
        });
        return email = _(result).findWhere({
          primary: true
        });
      } catch (_error) {
        e = _error;
      }
    }
  }

  // Add initial user to admin role
  Meteor.call('addFirstUserToAdminRole', userId);
});
