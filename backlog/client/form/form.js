// Collection imports
import ApiBacklogItems from '../../collection';

Template.apiBacklogItemForm.helpers({
  apiBacklogItemsCollection () {
    // Return a reference to ApiBacklogItems collection
    return ApiBacklogItems;
  },
  insertType () {
    const formType = Template.currentData().formType;
    // Return true if formType is insert, otherwise false
    return (formType === 'insert');
  },
});
