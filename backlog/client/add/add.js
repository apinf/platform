import { ApiBacklogItems } from '../../collection';

Template.addApiBacklogItem.helpers({
  apiBacklogItemsCollection () {
    // Return a reference to ApiBacklogItems collection
    return ApiBacklogItems;
  }
});
