import { Meteor } from 'meteor/meteor';
import { Blaze } from 'meteor/blaze';
import { Template } from 'meteor/templating';

Template.registerHelper('niceName', (_id) => {
  let user;
  if (_id) {
    user = Meteor.users.findOne(_id);
  }
  if (user) {
    if (user.username) {
      return user.username;
    } else if (typeof user.profile !== 'undefined' && user.profile.firstName) {
      return user.profile.firstName;
    } else if (user.emails[0].address) {
      return user.emails[0].address;
    } else {
      return 'An user';
    }
  }
});

Template.registerHelper('isTemplate', (templateName) => Blaze.isTemplate(Template[templateName]));
