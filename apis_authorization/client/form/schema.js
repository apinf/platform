import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const emailSchema = new SimpleSchema({
  emailAddress: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
});
