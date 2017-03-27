/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { FileCollection } from 'meteor/vsivsi:file-collection';

const ProjectLogo = new FileCollection('ProjectLogo', {
  resumable: true,   // Enable built-in resumable.js upload support
  http: [
    { method: 'get',
      path: '/md5/:md5',  // this will be at route "/gridfs/ApiLogos/:md5"
      lookup (params) {  // uses express style url params
        return { md5: params.md5 };       // a query mapping url to ApiLogos
      },
    },
  ],
});

export default ProjectLogo;
