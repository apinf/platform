// Collection imports
import Apis from '/apis/collection';

Template.apiSettingsDetails.helpers({
  apisCollection () {
    return Apis;
  },
});
