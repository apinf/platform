import { Apis } from "../../collection";

Template.addApi.helpers({
  ApisCollection () {
    // Make APIs collection available to template (i.e. autoform)
    return Apis;
  }
});
