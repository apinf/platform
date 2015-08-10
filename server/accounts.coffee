Accounts.onCreateUser (options, user) ->
    profileImageUrl = undefined
    user.profile = user.profile or {}

    if user.services?.facebook
        user.emails = [{address: user.services.facebook.email, verified: true}]
        user.profile.firstName = user.services.facebook.first_name
        user.profile.lastName = user.services.facebook.last_name
    if user.services?.google
        user.emails = [{address: user.services.google.email, verified: true}]
        user.profile.firstName = user.services.google.given_name
        user.profile.lastName = user.services.google.family_name
    if user.services?.github

        if(user.services.github.email == null or user.services.github.email == "")
            user.emails = [{address: "", verified: false}]
        else
            user.emails = [{address: user.services.github.email, verified: true}]

        user.profile.name = user.services.github.username;



    if user.services?.facebook?.id
        profileImageUrl = 'https://graph.facebook.com/v2.3/' + user.services.facebook.id + '/picture?type=normal'
    if user.services?.google?.id
        profileImageUrl = user.services.google.picture
    if user.services?.twitter?.id
        profileImageUrl = user.services.twitter.profile_image_url
    if user.services?.github?.id
        profileImageUrl = user.services.github.avatar_url

    if not profileImageUrl
        # Try and get via Gravatar
        # Gravatar currently always returns an image, whether the user set one or not.
        # It's possible to set {default: 404} and then detect a 404 status via HTTP request
        # This could increase the time needed to create a new user so it's avoided for now
        #
        # TODO: Set default profile picture in config. If 'null' then field is left blank

        email = user.emails?[0]?.address or ''
        profileImageUrl = Gravatar.imageUrl email, {default: 'identicon'}

    if  profileImageUrl
        picture = new FS.File()
        attachData = Meteor.wrapAsync picture.attachData, picture
        attachData profileImageUrl
        picture.name('picture ' + user._id + '.png')
        profilePicture = ProfilePictures.insert picture
        user.profile.picture = profilePicture._id

    # apiumbrella user obect to be send to apiUmbrellaWeb
    apiUmbrellaUserObj = {
      "user":{
        "email": user.emails[0].address,
        "first_name": "-",
        "last_name": "-",
        "terms_and_conditions":true
      }
    }

    response = apiUmbrellaWeb.adminApi.v1.apiUsers.createUser(apiUmbrellaUserObj)

    # adding to Aping user object ID of just created apiUmbrella User
    user.apiUmbrellaUserId = response.data.user.id

    # adding Api key to user profile
    # TODO: make apiKey field not editable or display api key on profile page separately from form - as a plain text
    user.profile.apiKey = response.data.user.api_key

    # adding umbrella user to apinf database
    ApiUmbrellaUsers.insert(response.data.user)
    Meteor.call("sendmail", user.emails[0].address)
    user

# This part is still under development since there was an issue in github-accounts package
# TODO: GitHub authentication with user's private email address
Accounts.onLogin (info) ->
  user = info.user
  if user.services?.github
    if user
      github = new GitHub(
        version: '3.0.0'
        timeout: 5000)
      github.authenticate
        type: 'oauth'
        token: user.services.github.accessToken
      try
        result = github.user.getEmails(user: user.services.github.username)
        email = _(result).findWhere(primary: true)

        # TODO: Work still in progress
        # Meteor.users.update { _id: user._id }, $set:
        #  'profile.email': email.email
        #  'services.github.email': email.email
        # user.emails = [{address: email.email, verified: true}]
        #console.log user
      catch e
        #console.log e.message
