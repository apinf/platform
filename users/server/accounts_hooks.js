import Github from 'github';

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

    // Search 'githubUsername' from database.
    var githubUsername = user.services.github.username;
    var existingUser = Meteor.users.findOne({'username': githubUsername});
    if(existingUser === undefined) {
      // Username available, set username to Github username.
      user.username = githubUsername;
    } else {
      // Username clashes with existing username, set empty.
      // Asking user to fill out username in profile page.
      user.username = '';
    }
  }

  return user;
});

Accounts.onLogin(function(info) {
  var e, email, github, ref, result, user;
  user = info.user;
  var userId = user._id;

  if ((ref = user.services) != null ? ref.github : void 0) {
    if (user) {
      github = new Github({
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
