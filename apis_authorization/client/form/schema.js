import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const emailSchema = new SimpleSchema({
  apiId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
});
