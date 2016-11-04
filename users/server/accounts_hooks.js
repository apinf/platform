import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  // Create empty user profile if none exists
  user.profile = user.profile || {};

  // Check for Github authentication
  if (user.services && user.services.github) {
    // Set user email address from Github email
    user.emails = [
      {
        address: user.services.github.email,
        verified: true,
      },
    ];

    // Search 'githubUsername' from database.
    const githubUsername = user.services.github.username;
    const existingUser = Meteor.users.findOne({ 'username': githubUsername });
    if (existingUser === undefined) {
      // Username available, set username to Github username.
      user.username = githubUsername;
    } else {
      // Username clashes with existing username, add prefix
      user.username = `gh-${githubUsername}`;
    }
  }

  // we wait for Meteor to create the user before sending an email
  Meteor.setTimeout(() => {
    Meteor.call('sendRegistrationEmailVerification', user._id);
  }, 2 * 1000);

  return user;
});
