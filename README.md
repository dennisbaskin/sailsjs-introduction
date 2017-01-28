# Prerequisites

## Github

Visit github.com. If you do not have an account, sign up for a free one and install locally:

https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

Then follow directions to configure it:

https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup

## If you do not have NVM (or node):

### Install NVM (node version manager)

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
```

> for windowz -> https://github.com/coreybutler/nvm-windows

check local versions

```
nvm ls
```

check remote versions

```
nvm ls-remote
```

Install latest node (I just go for the Current)

```
nvm install v7.3.0
```

Set it as default

```
nvm alias default v7.3.0
```

> Some systems come with node preinstalled (system node).
> When using NVM, any global npm modules you may have
> installed are not shared between the various versions of
> node.js you have installed. Some packages will need to
> be reinstalled.

# Introduction to sailsjs

## Install sails

When node installs it will also install the Node Package Manager (NPM). NPM can be use to install various packages, modules, plugins, helpers, etc. Start by installing sails.

```
npm install -g sails
```

## Create project

Go to the directory where you want the project to be installed (the project directory will be created later)

```
cd ~/
mkdir projects && cd projects
```

[create new project](http://sailsjs.com/get-started#?creating-a-new-sails-project)

```
sails new sailsjs-introduction
cd sailsjs-introduction/
```

Start the server

```
sails lift
```

You should see a message saying: "To see your app, visit http://localhost:1337"

Visit <http://localhost:1337>

## Create repo for project

Create new repository on github.com: sailsjs-introduction. Don't initialize with a README, git will create it for us.

First stop the server with CTRL+C then initialize repository:

```
git init
git add .
git commit -m 'first commit'
git remote add origin git@github.com:{username}/{project}.git
git push -u origin master
```

Where {username} is your username on github and {project} is `sailsjs-introduction`

# What is MVC?

Stands for "Model View Controller". It is a design pattern commonly used in
programming that focuses on seperation of concerns. The purpose is to keep your
application maintainable and easy to edit as it grows. At a basic level for
an MVC application it is generally agreed that the Model's concern is to manage
data and business rules, the View's concern is to represent the data and
business rules to the user, and the Controller's concern is to convert user
input into commands for the model and the view. https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller

While at a basic level you can get away with working with just these 3 levels
of abstraction, as an application grows it is typically quickly realized that
there is a need for a better organization structure. While MVC is a good start,
or even a good backbone, newer frameworks such as sailsjs (and new versions of
rails) introduce various other design concepts such as service objects,
policies, View Models, etc.

# Routing

Before a Controller is able to interpret user input, it has to be able to
receive it. We need to be able to decide which input is sent to which
Controller, and we need do this based on the http requests from the user. With
SailsJs *routes*, *routing* is a breeze.

Open `config/routes.js` and look for the following:

```
module.exports.routes = {
  '/': {
    view: 'homepage'
  }
};
```

## Views

What we currently have in the routes is an object with a key that describes the
HTTP route and it's value that delegates the functionality to the appropriate
controller, action, view, or any combination of. The only decleration we have is
saying is that the default HTTP route should load the homepage view. This
view can be found in the `views/` directory, named `homepage.ejs`. If we visit
the page (run `sails lift` first and then visit <http://localhost:1337>), you
should see the contents of this file displayed.

If you are going to be building an application that requires views to be
displayed, this is roughly how you will be creating them. In our example app we
will not focus on views. However, it is worth mentioning them to understand that
it is available to us if needed.

## Remove the Cruft

Let's delete `homepage.ejs` because we will creating a basic REST service with
JSON as the output. Reload the homepage in the browser and you should see an
error (in a JSON format) stating that the view is missing.

## Add a new default route

Replace the default route in your `config/routes.js` file with the following:

```
module.exports.routes = {
  'GET /': {controller: 'DefaultController'}
};
```

You can keep all of the generated comments above the `module.exports` line, but
replace everything else inside with the above.

What we have done here is explicitly specified that anytime someone makes a GET
request to the default url path, we want a controller named `DefaulController`
to decide what happens. Refresh the page in the browser. If you had not
restarted your server, you will notice that the error message didn't change. It
is still looking for `homepage.ejs` view.

The reason this happens is that the routes get loaded into memory at server
startup and not in runtime. Anytime you change, add, or remove routes, you will
need to restart your server.

After restarting your server (go to terminal running sails -> `CTRL+C` ->
`sails lift`), refresh the page in your browser. This time you should see a
fishy 404 page. In your terminal tab/window that is running sails, you can see
some error output. This error message was output at the time you restarted the
server. Going forward, this will be a good place to debug errors. You should see
something similar to:

`error: Ignored attempt to bind route (/) to unknown controller :: default.`

We will fix this in the next section when we discuss controllers. We will also
revisit routing as we continue creating our application. We have enough to
get us started at this point.


# Controllers

## Default controller

Lets use sails generators to generate a new default controller. In your terminal
in your project directory:

```
sails generate controller default index
```

http://sailsjs.com/documentation/concepts/controllers/generating-controllers
describes the concept and syntax.

This command will create a new file called `DefaultController.js` in the
directory `api/controllers/`. It will add the route we specified (index) inside
the file. It should look similar to the following:

```
/**
 * DefaultController
 *
 * @description :: Server-side logic for managing defaults
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * `DefaultController.index()`
   */
  index: function (req, res) {
    return res.json({
      todo: 'index() is not implemented yet!'
    });
  }
};

```

Open `routes.js` again and let's make a route adjustment:

change `'GET /': {controller: 'DefaultController'}'`

to: `'get /': 'DefaultController.index'`

## Capturing address parts as params

You can capture adress parts as named params. Let's change our route to:

```
'get /:name': 'DefaultController.index'
```

And we will update the controller to use this param:

```
  index: function (req, res) {
    var name = req.param('name') || 'unknown person';
    var greeting = 'Hello ' + name;

    return res.json({
      name: name,
      greeting: greeting,
    });
  }
```

Restart sails and view the page by going to <http://localhost:1337/John>. You
should see the reflected change in the response. However if you visit the same
url without the name <http://localhost:1337>, You will see an error. This is
because we have changed the route and our app no longer knows what to do when
there is nothing passed in. You can solve this by modifying the routes as
follows:

```
module.exports.routes = {
  'get /': 'DefaultController.index',
  'get /:name': 'DefaultController.index'
};
```

Restart the server and try both routes. You should have both working now.

# APIs

## Configure Blueprints

Before we move on, lets clean up our routes and add some configurations to our
blueprints config file.

Change routes to:

```
module.exports.routes = {
  'get /': 'DefaultController.index',
};
```

Then open `config/bluepints.js`. All options should be commented out but we will
change the following:

```
  ....

  rest: true,

  ...

  pluralize: true,
```

Turning on the `rest` option will give us access to a few freebies which we will
see in the section ahead.

## Generate api

So far we know that we can generate controllers using the terminal command
`sails generate controller <controllerName> [<action>, ...]`. One of the
features of sails is that you can quickly generate a controller and a model
together by using the following command: `sails generate api <apiItemName>`

Generate an api for User:

```
sails generate api user
```

Now we can check the files it created by typing `git status` and we should see
something similar to the following:

```
Untracked files:
  (use "git add <file>..." to include in what will be committed)

  api/controllers/UserController.js
  api/models/User.js
```

If you look inside each one of these you will notice that they are empty. This
method of generating new api files can be great. With our blueprint settings
configured we get some freebies. These freebies are in the form of REST paths.

If you open `config/routes.js` again you can verify nothing new was added.

Lets also modify our DefaultController one more time:

```
module.exports = {
  /**
   * GET /
   */
  index: function (req, res) {
    return res.json({});
  }
}
```

## Note on generating controllers and models individually

If you prefer to customize your api, you can opt to use individual genrators per
controller or model. You can generate the models with predefined attributes in
the command line. Likewise you can generate controllers with their actions
defined in the command line.

If we were to create a user custom user api the commands could look something
like this:

```
sails generate controller user create show update
sails generate model user name:string email:string password:string
```

Notice that in the model the attributes we specify are paired with a type. If we
were to leave off the types the generator would assume string by default. What
this means is that the above could have been written as:

```
sails generate model user name email password
```

## Migrations

When we run `sails lift` this time, we will get a message saying we have new
models but have not run migrations:

```
Excuse my interruption, but it looks like this app
does not have a project-wide "migrate" setting configured yet.
(perhaps this is the first time you're lifting it with models?)
```

It will also prompt you with a few options. For now choose "safe" (#1). We will
be covering migrations much in this introduction, except to say that for now we
will run migrate safe anytime the message shows up.

## Blueprint freebies

First, let's visit <http://localhost:1337> and verfiy that all we get is an
empty JSON object.

If you visit <http://localhost:1337/admin> you will see an error page. However,
if you visit <http://localhost:1337/users>, you will notice an empty array. Even
though we did not explicitly set any paths in our routes we still still get some
REST api endpoints for free:

```
HTTP Verb | Route       | CRUD   | Action
------------------------------------------------------------------------------
POST      | /:model     | CREATE | create:  creates a new `model`
GET       | /:model     | READ   | find:    get collection of `model` models
GET       | /:model/:id | READ   | findOne: outputs `model` with `id`=id
PUT       | /:model/:id | UPDATE | update:  updates `model` with `id`=id
PATCH     | /:model/:id | UPDATE | update:  updates `model` with `id`=id
------------------------------------------------------------------------------
```

Visiting <http://localhost:1337/users/1> now will give us an error stating that
the record with the specified ID could not be found. This is because we have not
created any records yet. To do so we will have to send a POST request to our
api. You can use curl in the command line or use a toll like Postman to do the
same, depending on what you are more comfortable with.

```
curl -H "Content-Type: application/json" -X POST -d '{"name":"bob","password":"123"}' http://localhost:1337/users
```

The response will output the created data and will contain the id of the created
record. Visit http://localhost:1337/users/1 and you will see the attributes for the new
user.

Add another record with a new attribute:

```
curl -H "Content-Type: application/json" -X POST -d '{"name":"bob","password":"123", "email":"123@testemail.com"}' http://localhost:1337/users
```

Visit <http://localhost:1337/users/2> and you will notice the new record with the
new attribute. However if you visit <http://localhost:1337/users/1> again you will
notice that the email attribute is missing. If you visit <http://localhost:1337/users>
you can see both records together.
