/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { FileCollection } from 'meteor/vsivsi:file-collection';

const ApiLogo = new FileCollection('ApiLogo', {
  resumable: true,
  resumableIndexName: 'apilogo',
  http: [
    {
      method: 'get',
      path: '/md5/:md5',
      // eslint-disable-next-line no-unused-vars
      lookup (params, query) {
        return {
          md5: params.md5,
        };
      },
    },
  ],
});

export default ApiLogo;
