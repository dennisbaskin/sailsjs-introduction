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

Visit [http://localhost:1337]

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
the page (run `sails lift` first and then visit localhost:1337), you should see
the contents of this file displayed.

If you are going to be building an application that requires views to be
displayed, this is roughly how you will be creating them. In our example app we
will not focus on views. However, it is worth mentioning them to understand that
it is available to us if needed.

## Remove the Cruft

Let's delete `homepage.ejs` because we will creating a basic REST service with
JSON as the output. Reload the homepage in the browser and you should see an
error (in a JSON format) stating that the view is missing.

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
