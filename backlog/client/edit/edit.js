import { ApiBacklogItems } from '../../collection';

Template.editBacklogItem.helpers({
  apiBacklogItemsCollection () {
    // Return a reference to ApiBacklogItems collection
    return ApiBacklogItems;
  }
});
