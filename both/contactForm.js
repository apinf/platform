Schemas.contact = new SimpleSchema({
  name: {
    type: String,
    label: "Your name",
    max: 50,
    optional: false,
    autoform: {
      placeholder: 'Your name'
    }
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: "E-mail address",
    optional: false,
    autoform: {
      placeholder: 'Your email'
    }
  },
  message: {
    type: String,
    label: "Message",
    max: 1000,
    optional: false,
    autoform: {
      rows: 5,
      placeholder: 'Your message'
    }
  }
});
