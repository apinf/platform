# Get involved

There are many ways to get involved:
* Contribute to our [Planning Documents](https://apinf.hackpad.com)
* Report bugs on our [issue tracker](https://github.com/apinf/api-umbrella-dashboard/issues/new)
* Add documentation via our [documentation repository](https://github.com/apinf/docs)
* Improve the code with pull requests
  * Choose a [task from our backlog](https://github.com/apinf/api-umbrella-dashboard/issues)

## Join the discussion

* Join the [Apinf Community portal](https://community.apinf.io) - ask and answer questions, share ideas, etc.
* Hang out in the [Apinf IRC chatroom](https://webchat.freenode.net/?channels=apinf) ([#Apinf](irc://irc.freenode.net/apinf) on Freenode)

# Contributing
Use the following guidelines when contributing to this project.

# Workflow
Please follow the [Gitflow guidelines](http://danielkummer.github.io/git-flow-cheatsheet/). Specifically:
* Create a new feature branch from the `develop` branch
* Prefix your feature branch name with `/feature`
* When ready for review, create a pull request against the `develop` branch
 * **Important:** Get another developer to review your pull request before merging

# Code quality
In a nutshell, **write code for humans to read and understand**. Our code will be minified for machines during the build process. For further reference, please [read Human JavaScript](http://read.humanjavascript.com/) by Henrik Joreteg.

## Comments
*Every* significant line of code should have an accompanying human language (English) comment. This is for several reasons:

* Comments act like a pair-programmer, explaining the code to other developers or your future self
* Comments may illuminate errors
  * logical errors where code is not doing what is expected
  * semantic errors where the code is not [literate](https://en.wikipedia.org/wiki/Literate_programming)

## One task per line
Each line of code should perform only one action. When chaining is important, each chained aciton should be placed on a new line.

## JavaScript semi-standard
Please follow the [JavaScript semi-standard coding style](https://github.com/Flet/semistandard).

## Variables
Use semantic variable names. Semantic variable names have the following traits:

* They succinctly describe what they represent
* Words are fully spelled out
* Variables with multiple words use camel case notation
* When used in subsequent lines of code, the variable name reads as close to a plain language sentence as possible

# File structure
This project is organized around a general Meteor architecture. In effect, folders are organized to indicate how Meteor.js treats them (e.g. whether they should be client-only).

* / (project root)
 * both/
   * collections/
 * client/
  * templates/
  * compatibility/
 * server/
  * methods/
  * publications/

## Packages
The project is built using the [Meteor.js framework](https://meteor.com). The following Meteor packages provide important functionality.

### Forms
[AutoForm](https://github.com/aldeed/meteor-autoform) is used to provide easy input forms, based on schema definitions (see below).

### Routing
* [Iron Router](https://github.com/iron-meteor/iron-router) is used for project routing.
* [Simple JSON Routes](https://github.com/stubailo/meteor-rest/) is used where only JSON data is needed from a route.

### Schema
[Simple Schema](https://github.com/aldeed/meteor-simple-schema) is used to create schemas for our database collections.

### Templating
[Blaze](https://meteor.github.io/blaze/) is the templating language used in our project packages.

### CSS
[Bootstrap](http://getbootstrap.com/) is the primary CSS framework for the templates.
