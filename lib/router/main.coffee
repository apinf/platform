Router.map ->
  @route "home",
    path: "/"
    layoutTemplate: "homeLayout"

  @route "apiBackends",
    path: "/apibackends"
    layoutTemplate: "homeLayout"

  @route "catalogue",
    path: "/catalogue"
    layoutTemplate: "homeLayout"

  @route "dashboard",
    path: "/dashboard"
    layoutTemplate: "masterLayout"
