import { Template } from 'meteor/templating';
import { ApiBacklogItems } from '../../collection';

Template.apiBacklogItemForm.helpers({
  apiBacklogItemsCollection () {
    // Return a reference to ApiBacklogItems collection
    return ApiBacklogItems;
  },
});
