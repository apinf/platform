import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.viewApiPageHeader.onCreated(() => {
  // Get reference to template instance
  const instance = this;

  // Create variable to track tour status
  instance.userShouldSeeIntro = new ReactiveVar(false);
});

Template.viewApiPageHeader.helpers({
  userShouldSeeIntro () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get value of tour status reactive variable
    const userShouldSeeIntro = instance.userShouldSeeIntro.get();

    return userShouldSeeIntro;
  },
});
