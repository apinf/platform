Router.route("/branding", function () {
  this.render("branding");
  this.layout("masterLayout");
}, {
  name: "branding"
});
