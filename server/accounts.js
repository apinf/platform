Accounts.onCreateUser(function(options, user) {
  var apiUmbrellaUserObj, attachData, email, picture, profileImageUrl, profilePicture, ref, ref1, ref2, ref3, ref4, response;
  profileImageUrl = void 0;
  user.profile = user.profile || {};
  if ((ref = user.services) != null ? ref.github : void 0) {
    if (user.services.github.email === null || user.services.github.email === "") {
      user.emails = [
        {
          address: "",
          verified: false
        }
      ];
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
  if (!profileImageUrl) {
    email = ((ref3 = user.emails) != null ? (ref4 = ref3[0]) != null ? ref4.address : void 0 : void 0) || '';
    profileImageUrl = Gravatar.imageUrl(email, {
      "default": 'identicon'
    });
  }
  if (profileImageUrl) {
    picture = new FS.File();
    attachData = Meteor.wrapAsync(picture.attachData, picture);
    attachData(profileImageUrl);
    picture.name('picture ' + user._id + '.png');
    profilePicture = ProfilePictures.insert(picture);
    user.profile.picture = profilePicture._id;
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
});
