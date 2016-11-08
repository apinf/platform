import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

Template.aboutApinf.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Create reactive variable to hold platform version number
  instance.platformVersion = new ReactiveVar();

  // Get platform version number from server method
  Meteor.call('getPlatformVersion', function (error, platformVersion) {
    // Set the platform version to the return value of get platform version
    instance.platformVersion.set(platformVersion);
  });
});

Template.aboutApinf.helpers({
  platformVersion () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get platform version number from reactive variable
    return instance.platformVersion.get();
  }
});
