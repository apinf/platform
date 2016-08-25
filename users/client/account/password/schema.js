const UpdatePasswordSchema = new SimpleSchema({
  old: {
    type: String,
    label: "Current Password",
    max: 50
  },
  "new": {
    type: String,
    min: 6,
    max: 20,
    label: "New Password"
  },
  confirm: {
    type: String,
    min: 6,
    max: 20,
    label: "Confirm new Password",
    custom: function () {
      // Make sure new password and password confirmation match
      if (this.value !== this.field('new').value) {
        return "updatePassword_passwordsMismatch";
      }
    }
  }
});

export { UpdatePasswordSchema };
