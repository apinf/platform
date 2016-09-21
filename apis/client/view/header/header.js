import { Template } from 'meteor/templating';

Template.viewApiPageHeader.helpers({
  userShouldSeeIntro () {
    return true;
  },
});
