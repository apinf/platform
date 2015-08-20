Accounts.onCreateUser(function(options, user) {
  var apiUmbrellaUserObj, attachData, email, ref, ref1, ref2, ref3, ref4, response;
  user.profile = user.profile || {};
  if ((ref = user.services) != null ? ref.github : void 0) {
    if (user.services.github.email === null || user.services.github.email === "") {
      user.emails = [
        {
          address: "",
          verified: false
        }
      ];
      // rewriting original error message if github email isn't public
      throw new Meteor.Error(500, 'Please, make your github email public in order to login.');
    } else {
      user.emails = [
        {
          address: user.services.github.email,
          verified: true
        }
      ];
    }
    user.profile.name = user.services.github.username;
  }
  if ((ref1 = user.services) != null ? (ref2 = ref1.github) != null ? ref2.id : void 0 : void 0) {
    profileImageUrl = user.services.github.avatar_url;
  }
  apiUmbrellaUserObj = {
    "user": {
      "email": user.emails[0].address,
      "first_name": "-",
      "last_name": "-",
      "terms_and_conditions": true
    }
  };
  response = apiUmbrellaWeb.adminApi.v1.apiUsers.createUser(apiUmbrellaUserObj);
  user.apiUmbrellaUserId = response.data.user.id;
  user.profile.apiKey = response.data.user.api_key;
  ApiUmbrellaUsers.insert(response.data.user);
  Meteor.call("sendmail", user.emails[0].address);

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
