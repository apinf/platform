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

# Submitting issues
There are a couple of common issue types in our tracker:
* Bug reports / support requests
* Features/enhancements

Please follow our issue guidelines, when submitting new issues.

## General details
Each issue should have the following details:
* brief, descriptive title
* short overview paragraph further describing the issue

## Feature/enhancement requests
Provide the following details for feature/enhancement requests:

* [user story](https://en.wikipedia.org/wiki/User_story) - short paragraph in the form of "As a [user role], I would like [feature/enhancement], so that [need fulfilled]"
* [wireframe](https://en.wikipedia.org/wiki/Website_wireframe) - simple, monochrome diagram depicting the desired user interface (in SVG or PNG format)
* acceptance criteria (simplified) - checklist of present tense statements describing how the feature behaves

### Feature/enhancement request example

> #### Add new widget to page
>
> The page does not have a widget. Add a widget to the page.
>
> #### User story
> ```
> As a registered user
> I need a widget on the page
> so that I have something to click
> ```
>
> #### Design
> [Monochrome diagram of the desired design, e.g. a wireframe.]
>
> #### Definition of Done
> The task is complete when the following criteria are satisfied:
> * [ ] Widget appears on page
> * [ ] User can click on widget

**Note:** Some of the above details will be added during the feature discovery and planning process.

## Bug reports / support requests
When submitting a bug report or support request, include the following details, if possible:

* steps to reproduce
* screenshot showing observed behavior
* description of observed behavior
* description of expected behavior
* relevant environment details (e.g. web browser, operating system, etc)

### Bug report/support request example

> #### Widget doesn't work when clicked
>
> On the page, the widget doesn't do anything when clicked.
>
> #### Steps to reproduce
> 1. View the page
> 1. Click the widget
>
> #### Observed behavior
> When clicking the widget, nothing happens.
>
> [Optionally include a screenshot, if it is relevant.]
>
> #### Expected behavior
> When clicking the widget, something should happen.
>
> #### Environment
> * Web browser
> * Operating system

**Note:** Some of the above details will be added during the discussion and testing process.

# Development installation with Docker

## Install Docker
Review the Docker installation instructions for your Operating System:
* [Mac](https://docs.docker.com/installation/mac/) ([Activates NFS on docker-machine](https://github.com/adlogix/docker-machine-nfs))
* [Linux](https://docs.docker.com/installation/ubuntulinux/)

Optionally [add your user to the `docker` group](https://docs.docker.com/engine/installation/linux/ubuntulinux/#create-a-docker-group).

## Install Docker Compose
You will also need to [install Docker Compose](https://docs.docker.com/compose/install/).
### Ubuntu
Install Docker Compose on Ubuntu Linux with the following command:

```
$ sudo apt install docker-compose
```

## Edit API Umbrella configuration

API Umbrella configuration should be stored in
* ```[project-root]/docker/api-umbrella/config/api-umbrella.yml```

You can create `api-umbrella.yml` based on the example:
* ```[project-root]/docker/api-umbrella/config/api-umbrella.yml.example```

## Prepare APInf image

1. Run application containers (in first time it will build image):
  ```
  $ docker-compose up
  ```
2. Add `apinf.dev` and `api-umbrella.dev` hosts entry to `/etc/hosts` file so you can visit them from your browser.


### See Docker IP address (step only for Mac)
```
$ docker-machine ip
=> 127.0.0.1
```

### Set hosts

Then add the IP to your `/etc/hosts`:
```
127.0.0.1 apinf.dev api-umbrella.dev
```

Now you can work with your app from browser by visit http://apinf.dev:3000

## Create API Umbrella credentials

1. [Login to the API Umbrella web admin](http://api-umbrella.readthedocs.org/en/latest/getting-started.html#login-to-the-web-admin) https://api-umbrella.dev/admin/login
2. Signup to the APInf http://apinf.dev:3000/sign-up
3. Login to the APInf web admin http://apinf.dev:3000/sign-in
4. Fill API Umbrella settings http://apinf.dev:3000/settings :

* Host: https://api-umbrella.dev
* API Key: [Get from step](http://api-umbrella.readthedocs.org/en/latest/getting-started.html#signup-for-an-api-key).
* Auth Token: Get from [My account page](https://api-umbrella.dev/admin)
* Base URL: https://api-umbrella.dev
* Elasticsearch Host: http://api-umbrella.dev:14002

## Debugging containers with docker exec

This can be accomplished by grabbing the container ID with a docker ps, then passing that ID into the docker exec command:

```
$ docker ps
CONTAINER ID        IMAGE
ce9de67fdcbe        apinf/apinf:latest
$ docker exec -it ce9de67fdcbe /bin/bash
root@ce9de67fdcbe:/#
```

Add alias to bash:
```
alias apinf_web='docker exec -it `docker ps | grep web | sed "s/ .*//"` /bin/bash'
```

## Building Docker Images

### Building Images

To build packages for the current APInf version:

```
$ docker build -t apinf/apinf:INSERT_VERSION_HERE .
$ docker tag apinf/apinf:INSERT_VERSION_HERE apinf/apinf:latest
```

### Pushing to Docker Hub

To publish the new images to our [Docker Hub repository](https://hub.docker.com/r/apinf/apinf/):

```
$ docker push apinf/apinf:INSERT_VERSION_HERE
$ docker push apinf/apinf:latest
```

# Contributing code
When contributing code, please follow the [Gitflow guidelines](http://danielkummer.github.io/git-flow-cheatsheet/). Specifically:

1. Create a new feature branch from the `develop` branch
2. Prefix your feature branch name with `/feature`

Additionally, the following steps help our team stay coordinated:

1. Immediately open a pull request by comparing your branch against the `develop` branch
2. Label your pull request as `WIP`, so that other developers can see the work in progress
3. When ready for review, @mention the development team, so that we know to review your code

**Important:** Getting developer feedback is part of our peer review process. It helps to highlight issues and improvements early in the process.

 ![git flow diagram with peer review step](https://openclipart.org/image/600px/svg_to_png/236560/Gitflow-featureBranch-peerReview.png)

## Code quality
In a nutshell, **write code for humans to read and understand**. Our code will be minified for machines during the build process. For further reference, please [read Human JavaScript](http://read.humanjavascript.com/) by Henrik Joreteg.

### Comments
*Every* significant line of code should have an accompanying human language (English) comment. Generally, comments should be placed on the line preceeding the code. This is for several reasons:

* Comments act like a pair-programmer, explaining the code to other developers or your future self
* Comments may illuminate errors
  * logical errors where code is not doing what is expected
  * semantic errors where the code is not [literate](https://en.wikipedia.org/wiki/Literate_programming)
* Natural language is easier for the human mind to parse than computer code
* Placing comments on the preceeding line, as opposed to the end of the line, improves readability
 * comment can be long, e.g. 80 characters
 * comments at same level of nesting fall in-line with one another vertically
 
#### Example comment
```js
// Try and find the missing widget
let missingWidget = Widgets.findOne({missing: true});
```

### One task per line
Each line of code should perform only one action. When chaining is important, each chained aciton should be placed on a new line.

#### Chaining example

Chained methods

```js
let pizza = new Pizza();

pizza
  .cook()
  .slice()
  .serve()
  .enjoy();
```

#### Complex line example
A complex line can be split into parts.

```js
// Complex line
let missingWidgetCount = Widgets.find({missing: true}).fetch().length;
```

```js
// Safer in parts
let missingWidgets = Widgets.find().fetch();

if (missingWidgets) {
 // Count the missing widgets
 let missingWidgetsCount = missingWidgets.length
 
 // Alert the boss!
 console.log(missingWidgetsCount, "widgets are missing!");
}
```

### Variables
Use semantic variable names. Semantic variable names have the following traits:

* They succinctly describe what they represent
* Words are fully spelled out
* Variables with multiple words use camel case notation
* When used in subsequent lines of code, the variable name reads as close to a plain language sentence as possible

#### Variable examples
Here are some not so meaningful variable names:

```js
// Stuff to eat (somewhat healthy)
let array1 = ["pizza slice", "yogurt", "strawberries"];

// Stuff to disgard
let array2 = ["tattered shoe", "broken pencil", "crumpled paper"];

// Things might get confusing later on
eat(array2);
disgard(array1);
```

Meaningful variable names carry their meaning through the code.

```js
// Stuff to eat
let food = ["pizza slice", "yohgurt", "strawberries"];

// Stuff to disgard
let trash = ["tattered shoe", "broken pencil", "crumpled paper"];

// Now it all makes sense!
eat(food);
disgard(trash);
```
### Code standard(s) and Lint
Configure your IDE to use eslint with the Airbnb styleguide.

Reference: Meteor Guide - Check  Your Code with ESLint [Integrating with your editor](https://guide.meteor.com/code-style.html#eslint-editor)

# File structure
This project is organized around a 'module' / 'component' architecture. 

By 'module', we mean anything that has it's own database collection and one or more routes. Components are more closely related to the idea of [WebComponents](http://webcomponents.org/), which are intended to be reusable, hierarchical user interface elements. Modules are located in the project root, with components in the client sub-directory.

In general, our module structure follows this pattern:

* **/module_name**
  * **client/**
    * **component_one/**
      * *component_one.css*
      * *component_one.html*
      * *component_one.js*
      * **sub_component/**
        * *sub_component.css*
        * *sub_component.html*
        * *sub_component.js*
    * **lib/**
      * *router.js*
  * **collection/**
    * *index.js*
    * *schema.js*
    * *permissions.js*
    * *helpers.js*
    * **server/**
      * *publications.js*
  * **server/**
    * *methods.js*

## File names
Please use underscores in folder and file names, rather than hyphens or camel case. E.g.

```js
folder_name/file_name.css
folder_name/file_name.html
folder_name/file_name.js
```
# Collection/Schema structure
After some trial and error, we have settled on the following pattern for defining collections and schemas:

```js
// inside 'component/collection/index.js'

// Define collection name variable with corresponding MongoDB collection name in camelCase
const CollectionName = new Mongo.Collection("collectionName");

// Export the collection
export { CollectionName };
```

Next, we need to attach a schema to the collection, for validation, etc.

```js
// inside 'component/collection/schema.js'

// Import the collection using relative path
import { CollectionName } from './';

// Define the collection schema, by attaching a 'schema' property
CollectionName.schema = new SimpleSchema({
  // Schema field definitions
});

// Allow collection internationalization
CollectionName.schema.i18n("schemas.collection_name");

// Attach schema to collection for validation, etc.
CollectionName.attachSchema(CollectionName.schema);
```

References:
- Meteor Guide: Code Style - [Collections](https://guide.meteor.com/code-style.html#collections)
- Meteor Guide: [Collections and Schemas](https://guide.meteor.com/collections.html#schemas)

# Packages
The project is built using the [Meteor.js framework](https://meteor.com). The following Meteor packages provide important functionality.

## Forms
[AutoForm](https://github.com/aldeed/meteor-autoform) is used to provide easy input forms, based on schema definitions (see below).

## Routing
* [Iron Router](https://github.com/iron-meteor/iron-router) is used for project routing.
* [Simple JSON Routes](https://github.com/stubailo/meteor-rest/) is used where only JSON data is needed from a route.

## Schema
[Simple Schema](https://github.com/aldeed/meteor-simple-schema) is used to create schemas for our database collections.

## Templating
[Blaze](https://meteor.github.io/blaze/) is the templating language used in our project packages.

## CSS
[Bootstrap](http://getbootstrap.com/) is the primary CSS framework for the templates.
