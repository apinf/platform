import { Template } from 'meteor/templating';

Template.settingsMenu.helpers({
  isActive (route) {
    return (route === Router.current().route.getName()) ? 'active' : '';
  }
});
