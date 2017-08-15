/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import Apis from '/imports/apis/collection';
import ApiBookmarks from './';

ApiBookmarks.helpers({
  apis () {
    return Apis.find({ _id: { $in: this.apiIds } });
  },
});
