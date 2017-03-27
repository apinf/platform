/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

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
