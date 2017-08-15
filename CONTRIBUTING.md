Use the following guidelines when contributing to this project.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Get involved](#get-involved)
  - [Join the discussion](#join-the-discussion)
- [Submitting issues](#submitting-issues)
  - [General details](#general-details)
  - [Feature/enhancement requests](#featureenhancement-requests)
    - [Feature/enhancement request example](#featureenhancement-request-example)
  - [Bug reports / support requests](#bug-reports--support-requests)
    - [Bug report/support request example](#bug-reportsupport-request-example)
- [Contributing code](#contributing-code)
  - [Branching strategy](#branching-strategy)
    - [Importance of git history](#importance-of-git-history)
    - [Git rebase](#git-rebase)
  - [Copyright statement in source code](#copyright-statement-in-source-code)
  - [CSS styleguide](#css-styleguide)
  - [Code quality](#code-quality)
    - [Simplicity and safety](#simplicity-and-safety)
    - [Importing](#importing)
    - [Comments](#comments)
      - [Example comment](#example-comment)
    - [One task per line](#one-task-per-line)
      - [Chaining example](#chaining-example)
      - [Complex line example](#complex-line-example)
    - [Variables](#variables)
      - [Variable examples](#variable-examples)
    - [Code standard(s) and Lint](#code-standards-and-lint)
    - [Indentation](#indentation)
    - [Quotes](#quotes)
    - [Whitespace](#whitespace)
        - [Handlebars helpers](#handlebars-helpers)
  - [File structure](#file-structure)
    - [File names](#file-names)
  - [Collection/Schema structure](#collectionschema-structure)
    - [Explicit required fields](#explicit-required-fields)
    - [Schema changes](#schema-changes)
  - [Internationalization (i18n)](#internationalization-i18n)
    - [i18n key structure](#i18n-key-structure)
    - [Template text (HTML/Blaze)](#template-text-htmlblaze)
    - [JavaScript text](#javascript-text)
- [Automated testing](#automated-testing)
  - [End to End](#end-to-end)
    - [Test suite execution](#test-suite-execution)
      - [Running only specific test](#running-only-specific-test)
- [Packages](#packages)
  - [Forms](#forms)
  - [Routing](#routing)
  - [Schema](#schema)
  - [Templating](#templating)
  - [CSS](#css)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Get involved

There are many ways to get involved:
* Contribute to our [Planning Documents](https://apinf.hackpad.com)
* Report bugs on our [issue tracker](https://github.com/apinf/platform/issues/new)
* Add documentation via our [documentation repository](https://github.com/apinf/docs)
* Improve the code with pull requests
  * Choose a [task from our backlog](https://github.com/apinf/platform/issues)

## Join the discussion

* Join the [Apinf Community portal](https://community.apinf.io) - ask and answer questions, share ideas, etc.
* Hang out in the [Apinf IRC chatroom](https://webchat.freenode.net/?channels=apinf) ([#Apinf](irc://irc.freenode.net/apinf) on Freenode)

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

## Branching strategy

### Importance of git history
The idea behind the importance of Git history (to name a few) is that:

1. A clean log allows easy tracking of project over time
1. Allows using tools like `git bisect` without any hassle
1. Reduces conflicts during merging the `feature` or `hotfix` branches to `develop` branch

Further, since we would be getting closer to supporting multiple releases and for different customers, it makes a lot of sense to have a code where backporting of minor security fixes is possible. I hope that all of us here appreciate the fact that when merging a PR or even cherry picking a security fix, the whole process should not take more than hitting enter on the relevant command. A relatively linear history allows this to happen with minimum or less hassles.

### Git rebase
This comment focuses on `git rebase`:

One of the most powerful features of git is the ability to commit often, fix history if needed and push once done. In all the **personal feature branches** we should use this strategy. So, when a feature has to be developed this is what we should follow:

1. Create a feature branch for all the development
1. Do all the development in the feature branch
1. Merge to `develop` once the feature has been **DONE**

In a continuous development environment, there are chances that the `develop` will be updated before a developer finishes his/her feature. So, the following thumb rules should be applied:

1. **A rebase a day keeps conflicts away**: These guidelines recommends to a developer that they should rebase their branch _(= update your branch w.r.t. latest develop)_ once every morning before they start their regular work.
1. **A rebase must be performed before creating a PR**.

An example for rebase is given below (with a new repository and using master instead of develop, apologies ;-) ).

![image](https://cloud.githubusercontent.com/assets/5460151/25945611/397f3bba-3650-11e7-9fd0-f5e6b73e2a08.png)
^^ above:
* New repo was initiated
* Initial commit was added to master
* Feature branch `feature-01` was created and completed
* Assumption is that there might be new commits in `master` by the time `feature-01` is finished.

![image](https://cloud.githubusercontent.com/assets/5460151/25945732/b2c2250a-3650-11e7-94c0-7d9713047bf3.png)

^^ and there are new commits in master. We should update our `feature-01` branch w.r.t. latest in `master`

![image](https://cloud.githubusercontent.com/assets/5460151/25945923/8080305e-3651-11e7-82ce-f7c92ac7b272.png)

^^ `feature-01` before `git rebase master`

![image](https://cloud.githubusercontent.com/assets/5460151/25945947/9160cb22-3651-11e7-9431-ee8d1d84599d.png)

^^ Initiated `git rebase master` and state of the feature branch after the rebase. As you can see that the `commit c59309b` has been applied to `feature-01` and then, the implementation of `feature-01` is applied to the tree.. **This is how we should follow**.

Remember that at this stage, you might also get conflicts and you should **resolve the conflicts here**. Once the `feature-01` has been updated w.r.t. `master` (and in our case, w.r.t. `develop`), then a PR must be made from `feature-01` -> `develop`.

![image](https://cloud.githubusercontent.com/assets/5460151/25946082/38cddb2a-3652-11e7-9b4b-696703e7c6ab.png)

Github already uses a --no-ff merge strategy so, we need not worry about that.

## Copyright statement in source code

All files should have a copyright statement at the top.
In practise it means that if you create a new file, you need to include a copyright statement as a comment at the top of it.

```
Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11
```

## CSS styleguide

File structure:

*   Each template - own style file
*   Each style file - overriding section, function section
*   Everything global - global.less file

## Code quality
In a nutshell, **write code for humans to read and understand**. Our code will be minified for machines during the build process. For further reference, please read the following:
- [Human JavaScript](http://read.humanjavascript.com/) by Henrik Joreteg
- [Clean Code rules for JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

### Simplicity and safety
When writing code, tend towards simple and explicit solutions. Avoid cleverness when possible, as it may come back to bite us.

Please read and follow the following guidelines:

- [10 Rules for Writing Safety Critical Code](http://spinroot.com/p10/)
- [The Zen of Python](https://www.python.org/dev/peps/pep-0020/)

### Importing 

Add importing statements right after the copyright notice.

The sections should be one of the below and the comments must be exactly the same text. They also should follow this order unless `eslint` complains about it.

* Meteor packages imports - anything imported straight from meteor
* Meteor contributed packages imports - contributed packages, like kadira:flow-router or tap:i18n
* Collection imports - all collections needed by the current file
* APInf imports - any custom file, probably from `/core`
* Npm packages imports - if importing packages from npm are needed

Examples below:

```js
// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import ApiMetadata from '../../collection';

// APInf imports
import formatDate from '/packages/core/helper_functions/format_date';

// Npm packages imports
import _ from 'lodash';
```

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

[eslint](https://eslint.org) is configured to run on every commit on Continuous Integration server.

The project is configured with the Airbnb styleguide and meteor recommendation for eslint.

To run locally, do:

```bash
yarn run lint
```

### Indentation
Indent all HTML(Blaze) and JavaScript code with two spaces for each level of nesting.

Also, nest most/all HTML child elements -- i.e. avoid having multiple inline elements.

```html
<p>
  <!-- nesting is important for readability -->
  <!-- e.g. when adding long internationalization keys -->
  Paragraph text.
</p>
```
### Quotes
Please use quotation marks (`""` and `''`) consistently. In general,

- use single quotes in JavaScript
  - e.g. 'here is a string'
- use single quotes in handlebars
  - e.g. `{{_ 'i18n_token' }}`
- use double quotes in HTML
  - e.g. `<a href="...">Link</a>`

### Whitespace
Please use consistent whitespace in project files. In general, whitespace is used to help people read our code.

- use two spaces for indentation in HTML and JavaScript files

##### Handlebars helpers
Please observe the following structure when working with handlebars syntax:

- Handlebars (`{{`) and prefixes (`>`, `#`, `/`, and `_`) should be placed next to each other.
  - Examples: `{{> ... }}`, `{{# ... }}`, `{{/ ... }}`, `{{_ ... }}`
- include a space before the closing handlebars `}}`
  - Example: `{{ ... }}`
- use spaces on both sides of handlebars words
  - Examples: `{{# if }}`, `{{ else }}`, `{{_ 'i18n_token' }}`

## File structure
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

### File names
Please use underscores in folder and file names, rather than hyphens or camel case. E.g.

```js
folder_name/file_name.css
folder_name/file_name.html
folder_name/file_name.js
```
## Collection/Schema structure
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
### Explicit required fields
When defining schemas, we need to designate some fields as *required* or *optional*. By default if we do not designate a field as *required* or *optional*, it will be implicitly *required*.

Following the guideline of **explicit is better than implicit**, all fields should be explicitly defined as *required* or *optional*:

```js
// Schema object
requiredField : {
  ...
  optional: false
},
optionalField: {
  ...
  optional: true
}
```

### Schema changes

To make upgrading convenient & keep application database consistent we want to have
a proper data migration path for the application.

As a developer, provide a proper migration step in your PR if you make changes to any
collection schema structure.

Location for migrations is under /core/migrations/server/

**Steps:**

* Add a new file for migration, format (migration-version-number)-(short-migration-name).js
* Write migration function for 'up' step

Example migration step:

```js
Migrations.add({
  version: 1,
  name: 'Adds pants to all people in the db.',
  up () {
    // code to migrate up to version 1
    // Add pants to all people that don't have.
  }
});
```

We are using *percolate:migrations* package for migrations. For additional info check
[README](https://github.com/percolatestudio/meteor-migrations/edit/master/README.md).

**References:**
- Meteor Guide: Code Style - [Collections](https://guide.meteor.com/code-style.html#collections)
- Meteor Guide: [Collections and Schemas](https://guide.meteor.com/collections.html#schemas)

## Internationalization (i18n)
To the extent possible, all user-facing text should be internationalized. To add internationalization support for texts, we use the following conventions.

### i18n key structure
Internationalization keys in our project use the following elements, separated by underscores
- `templateName` - the name of the template as it appears in either:
  - the `<template name="templateName">`
  - the `{{# AutoForm id="formName" }}`
- `pageElement` or `event` - indicate the page element or JS related event
- `additionalText` - additional text to distinguish this string from others (optional)


### Template text (HTML/Blaze)
Text in HTML/Blaze templates can be internationalized by adding an i18n tag:

```html
{{_ "templateName_pageElement_additionalText" }}
```

A specific example, found on a page element heading:

```html
<!-- note the element nesting, for readability -->
<h1 class="page-header">
  {{_ "pageTemplate_header_text" }}
</h1>
```

### JavaScript text
When internationalization strings are used in JavaScript, use the following pattern:

1. fetch the ii18n string and store it in a descriptive variable
2. use the i18n variable in related code

For example, when showing an `sAlert` to the user:

```js
// Get a translation string
const message = TAPi18n._("templateName_event_translationString");

// Use the translation string
sAlert.warning(message);

```

# Automated testing

## End to End

There are some end to end tests on the `tests` directory. They were built using [chimp.js](https://github.com/xolvio/chimp).

### Test suite execution

In order to run the end to end tests, the application must be running on a separated process

```bash
$ meteor run
```

And the tests can be run via yarn

```bash
$ yarn run chimp-test
```

A new google chrome window will open and the scripts will be run there.

#### Running only specific test

It is possible to run a specific test file by changing `tests/chimp-config.js` file, under `mocha_config.grep` setting.

Since the test cases begin with a number, just put a number to run the desired file.

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
