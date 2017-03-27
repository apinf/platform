/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const managerSchema = new SimpleSchema({
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  numberOfApisPerPage: {
    type: String,
    autoform: {
      type: 'select',
      firstOption: false,
      label: false,
      options () {
        return [
          { label: '4', value: 4 },
          { label: '8', value: 8 },
          { label: '12', value: 12 },
          { label: '16', value: 16 },
          { label: '20', value: 20 },
          { label: '24', value: 24 },
        ];
      },
    },
  },
  numberOfMediasPerPage: {
    type: String,
    autoform: {
      type: 'select',
      firstOption: false,
      label: false,
      options () {
        return [
          { label: '4', value: 4 },
          { label: '8', value: 8 },
          { label: '12', value: 12 },
          { label: '16', value: 16 },
          { label: '20', value: 20 },
          { label: '24', value: 24 },
        ];
      },
    },
  },
});

export default managerSchema;
