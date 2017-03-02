// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Apis from '/apis/collection';

Template.apiSettingsDetails.helpers({
  apisCollection () {
    return Apis;
  },
});
