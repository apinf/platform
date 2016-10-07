import { Apis } from '/apis/collection';

Template.apiSettings_details.helpers({
  apisCollection () {
    return Apis;
  },
});
