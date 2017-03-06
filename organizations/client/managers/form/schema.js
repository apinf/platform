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
});

export default managerSchema;
