Router.route("/profile", {
  layout: "masterLayout",
  template: "profile",
}, {
  name: "profile"
});

Router.route("/account", {
  layout: "masterLayout",
  template: "account",
}, {
  name: "account"
});
