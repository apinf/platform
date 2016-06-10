import { Template } from 'meteor/templating';

Template.catalogue.onCreated(function () {
  console.log("Catalogue container created.");
});
