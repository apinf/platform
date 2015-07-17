Router.map ->
  @route "home",
    path: "/"
    layoutTemplate: "homeLayout"

  @route "apiBackends",
    path: "/apibackends"
    layoutTemplate: "masterLayout"

  @route "catalogue",
    path: "/catalogue"
    layoutTemplate: "masterLayout"

  @route "bookmarks",
    path: "/bookmarks"
    layoutTemplate: "masterLayout"

  @route "dashboard",
    path: "/dashboard"
    layoutTemplate: "masterLayout"

  @route "swagger",
    path: "/swagger"
    layoutTemplate: "masterLayout"

  @route "consumerDashboard",
    path: "/consumerDashboard"
    layoutTemplate: "consumerDashboardLayout"
