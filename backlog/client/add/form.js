import { ApiBacklogItems } from '../../collection';

Template.apiBacklogForm.helpers({
  apiBacklogItemsCollection () {
    // Return a reference to ApiBacklogItems collection
    return ApiBacklogItems;
  }
});
