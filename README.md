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

# Introduction to SailsJs

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

# Database

This is due to how the data is saved using the default database adapter. The
defult adapter is sails-disk and it creates a file named `localDiskDb.db` inside
of the `.tmp` directory. If you open the file you should see the following:

```
{
  "data": {
    "user": [
      {
        "name": "bob",
        "password": "123",
        "createdAt": "2017-01-28T04:45:49.865Z",
        "updatedAt": "2017-01-28T04:45:49.865Z",
        "id": 1
      },
      {
        "name": "bob",
        "password": "123",
        "email": "123@testemail.com",
        "createdAt": "2017-01-28T04:54:49.338Z",
        "updatedAt": "2017-01-28T04:54:49.338Z",
        "id": 2
      }
    ]
  },
  "schema": {
    "user": {
      "id": {
        "type": "integer",
        "autoIncrement": true,
        "primaryKey": true,
        "unique": true
      },
      "createdAt": {
        "type": "datetime"
      },
      "updatedAt": {
        "type": "datetime"
      }
    }
  },
  "counters": {
    "user": {
      "id": 2
    }
  }
}
```

The main thing to notice here is how the schema is set up. A schema defines a
structure for your database tables. Based on the above you can see that the
actual structure of the users table is made up of 3 fields: id, createdAt,
and updatedAt. In an RDBMS (Relational Database Managment System), these would
be described as the columns for the associated table. From here on I will refer
to them as columns for simplicity.

These columns are generated by default for you when you migrate. They are so
commonly used in database table designs that by convention they are
automatically added. Each can be customized per project use.

For example, the id is added because it is quite common to have a sequence as
your primary key. You can configure this to use UUIDs instead if your app
requires it. You can look at the SailsJs documentation on their site
( http://sailsjs.com/documentation/concepts/models-and-orm/attributes ) or
search google for help on accomplishing this task.

## Adding custom attributes

In the User model add an attribute named `email` with a type `string`:

```
module.exports = {
  attributes: {
    email: { type: 'string' }
  }
};
```

Then, lets make a couple more requests. The first with an email and the second
without:

```
curl -H "Content-Type: application/json" -X POST -d '{"name":"John","password":"123", "email":"John.Email@testemail.com"}' http://localhost:1337/users
```

```
curl -H "Content-Type: application/json" -X POST -d '{"name":"No Email Man","password":"123"}' http://localhost:1337/users
```

If we look at the schema again, we can verify that a new email "column" was
added, but our new user is missing the email:

```
{
  "data": {
    "user": [
      {
        "name": "bob",
        "password": "123",
        "createdAt": "2017-01-28T04:45:49.865Z",
        "updatedAt": "2017-01-28T04:45:49.865Z",
        "id": 1
      },
      {
        "name": "bob",
        "password": "123",
        "email": "123@testemail.com",
        "createdAt": "2017-01-28T04:54:49.338Z",
        "updatedAt": "2017-01-28T04:54:49.338Z",
        "id": 2
      },
      {
        "name": "John",
        "password": "123",
        "email": "John.Email@testemail.com",
        "createdAt": "2017-01-29T19:50:07.260Z",
        "updatedAt": "2017-01-29T19:50:07.260Z",
        "id": 3
      },
      {
        "name": "No Email Man",
        "password": "123",
        "createdAt": "2017-01-29T19:51:10.793Z",
        "updatedAt": "2017-01-29T19:51:10.793Z",
        "id": 4
      }
    ]
  },
  "schema": {
    "user": {
      "email": {
        "type": "string"
      },
      "id": {
        "type": "integer",
        "autoIncrement": true,
        "primaryKey": true,
        "unique": true
      },
      "createdAt": {
        "type": "datetime"
      },
      "updatedAt": {
        "type": "datetime"
      }
    }
  },
  "counters": {
    "user": {
      "id": 4
    }
  }
}
```

The reason it is still letting us do this is because we have no constraints on
the email field. We can add a required constraint (which in a RDBMS would
translate to a NOT NULL db constraint):

```
module.exports = {
  attributes: {
    email: {
      type: 'string',
      required: true,
    }
  }
};
```

Restart sails and allow it to do the safe migration. Afterward try adding
another user without an email:

```
curl -H "Content-Type: application/json" -X POST -d '{"name":"No Email Man","password":"123"}' http://localhost:1337/users
```

This time you should get a response with an error:

```
{
  "invalidAttributes": {
    "email": [
      {
        "rule": "string",
        "message": "Value should be a string (instead of null, which is an object)"
      },
      {
        "rule": "required",
        "message": "\"required\" validation rule failed for input: null\nSpecifically, it threw an error.  Details:\n undefined"
      }
    ]
  },
  "model": "User",
  "_e": {},
  "rawStack": ... ,
  "code": "E_VALIDATION",
  "status": 400,
  "details": ...,
  "message": ... ,
  "stack": ...
}
```

At this point you can add another user or two. Once you do, take a look the
users list to see that they are added correctly.

You are no longer able to add invalid data; records which do not have an email.
However, you still have old records that are invalid. There are ways of fixing
this, but for now know that there are certain limitations between databases with
which you choose to work with.

One option you have to make sure all records match is to just drop the db and
start from scratch with the new schema. This should go without saying, but you
should never run this in a production environment.

## [Optional:] Use an RDBMS

This section is optional. I recommend going through this if you are going to be
using an RDBMS instead of a NoSQL db. Since this section is completely optional,
I will only go into details to get Postgres installed on a Mac. Installion of
other RDBMSs or on other OSs will only be briefly mentioned.

### Install an RDBMS on Mac

Install `homebrew` if you do not yet have it. Visit <http://brew.sh/>. On their
page they will have the following command to run the installer:

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Once homebrew is installed, we can easily install any RDBMS you like

#### Postgres :heart:

In your terminal install postgres with love:

```
brew install postgresql
```

Homebrew also allows to to easily start the service in the background:

```
brew services start postgresql
```

If you do not need a background service you can run:

```
pg_ctl -D /usr/local/var/postgres start
```

> You will most likely want to eventually capture logging information. Postgres
> allows you to do this at start up. I will not cover this part, but it is good
> to know that it is available. Ideally you will have a startup script that does
> all of this for you.

Before we can do anything, we need to initialize a database storage area on
disk (a *database cluster* per postgres terminology).

```
initdb /usr/local/var/postgres
```

> If you get a message telling you that you already have this directory, then
> most likely you already have postgres installed. This is fine and we can
> continue or you can delete the entire folder if you know you never use it, and
> rerun the initialization.

##### Run Postgres at startup

Check if the directory `~/Library/LaunchAgents` exists. Create it if it doesn’t
exist:

```
mkdir ~/Library/LaunchAgents`
```

Find ypour postgres version

```
postgres --version
```

At the time of writing this mine is 9.6.1. Find the plist file that came with
the postgres install. Make sure to replace the version number with yours:

```
/usr/local/Cellar/postgresql/9.6.1/homebrew.mxcl.postgresql.plist
```

Copy the plist file to the LaunchAgents directory.

```
cp /usr/local/Cellar/postgresql/9.6.1/homebrew.mxcl.postgresql.plist ~/Library/LaunchAgents/
```

Now use launchctl to load the file using this command:

```
launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist
```

Now when the computer reboots, postgres will automatically startup.

##### Create a user

For convenience, the programs `createuser` and `dropuser` are provided as
wrappers around these `CREATE ROLE name` and `DROP ROLE name` SQL commands that
can be called from the shell command line. Let's create a user named `sails`.

```
createuser -P sails
```

##### Create a new db

```
createdb sails-test
```

The `-P` flag will tell it the program that you want to create the user with a
pasword and will prompt you to enter one, and then to confirm it.

> If you forget the password to this user yoiu can always drop user and enter a
> new password.

#### MySql

If you choose to use MySQL you can either install via mysql installer at
<https://dev.mysql.com/downloads/mysql/> or just download the MAMP stack
from <https://www.mamp.info/en/> which will install an Apache, MySQL, and
PHP stack for you.

### Install an RDBMS on Windows

#### Postgresql

To use postgres on windows you can follow the steps in the following tutorial:

<http://www.postgresqltutorial.com/install-postgresql/>

This will involve installing the program from
<http://www.postgresql.org/download/windows/>. When you have postgres installed
make sure to create a user named `sails` and start the service.

#### MySql

If you choose to use MySQL you can either install via windows installer at
<https://dev.mysql.com/downloads/installer/> or just download the WAMP stack
from <http://www.wampserver.com/en/> which will install an Apache, MySQL, and
PHP stack for you.

### Configure Sails to use different DB

Sails comes bundled with an ORM called Waterline. It allows you to use a variety
of adapters to connect to a databse of your choice. It allows you to not change
how you interface to your databese through code.

First lets install the apropriate adapter. In my example it will be postgres. In
your project directory in your terminal run:

```
npm install sails-postgresql --save
```

The option `--save` will automatically add this node package to your
`package.json` file.

Next we need to configure your connections and models files inside the config
directory. First open `config/connections.js` and comment out the section
referencing localDisk:

```
  // localDiskDb: {
  //   adapter: 'sails-disk'
  // },
```

There is a predefined section for postgres which you can use as a template:

```
  // somePostgresqlServer: {
  //   adapter: 'sails-postgresql',
  //   host: 'YOUR_POSTGRES_SERVER_HOSTNAME_OR_IP_ADDRESS',
  //   user: 'YOUR_POSTGRES_USER', // optional
  //   password: 'YOUR_POSTGRES_PASSWORD', // optional
  //   database: 'YOUR_POSTGRES_DB' //optional
  // }
```

Replace it with the following:

```
  postgres: {
    adapter: 'sails-postgresql',
    host: 'localhost',
    user: 'sails',
    password: '',
    database: 'sails-test'
  }
```

Notice that we changed `somePostgresqlServer` to `postgres`. This is the name we
will use when we define which connection to use. If you created a user with a
password, add it to the password field.

> NOTE: ideally you will be using environment variables to set these options.
> You can do so by using process.env.MY_VAR, just like any node app.

Next, open `config/models.js` and uncomment the connections option, and change
it to point to `postgres`. This is what we named the connection in the
connections file. We can also uncomment the migrate option and set it to alter.
This way we will no longer need to choose an option everytime we lift sails. The
file should have the following options:

```
module.exports.models = {
  connection: 'postgres',
  migrate: 'alter',
};
```

At this point you are set to go. But just to verify everything still works, we
should do some sanity checks. First we will restart the server. You should
notice that we are no longer prompted to migrate, and we should not be seeing
any error messages.

If you are seeing any errors, make sure you have correctly setup the options,
that your names match, and that you have the correct user pasword if you entered
one. Otherwise look at the logs to help you trouble shoot.

#### Verifying the database

In your terminal, we need to connect to a database via the `psql` command. The
command starts a command line utility that allows us to interface with postgres.

```
psql sails-test
```

We add the name of our database (`sails-test`) at the end so that we directly
connect to it. If have installed postgres as a different system user (which you
should when setting it up for staging or production environments), you can use
the `-U` flag to connect as that user:

```
psql -U some_user sails-test
```

From here postgres is very simple to work with. At any time if you are unsure of
any commands you can type `\?` in psql, and it will list available commands
which you can use. Manu of these commands are just simple alternatives to
directly typing out SQL queries. You can also run raw SQL queries as well.

Let's check that our migration did what we expected and that we still have our
user table by listing our databse's tables:

```
\dt
```

It should show the following:

```
sails-test-# \dt
       List of relations
 Schema | Name | Type  | Owner
--------+------+-------+-------
 public | user | table | sails
(1 row)
```

We can see that the migration succefully created our table. We should also
verify that our table structure is good by running:

```
\d user
```

Which should result in:

```
sails-test-# \d user
                                   Table "public.user"
  Column   |           Type           |                     Modifiers
-----------+--------------------------+---------------------------------------------------
 email     | text                     |
 id        | integer                  | not null default nextval('user_id_seq'::regclass)
 createdAt | timestamp with time zone |
 updatedAt | timestamp with time zone |
Indexes:
    "user_pkey" PRIMARY KEY, btree (id)
```

We can also try and select all records from the table.

```
TABLE public.user;
```

`TABLE` is a nice shortcut for `SELECT * FROM`. We should not have any entries.

> Note that we had to write out public, as there is an internal user table for
> postgres users.

#### Verifying data

Let's add a user again via our API:

```
curl -H "Content-Type: application/json" -X POST -d '{"name":"Email Man","password":"123", "email": "123@abc.com"}' http://localhost:1337/users
```

We can check what has been added by either going back to psql or opening a
browser tab to <http://localhost:1337/users>. The first thing to notice here is
that we tried to pass in a name and password, and they were completely ignored.
The reason is that we are not just storing a string representation of data, but
rather we are storing the individual data pieces. We are limited to our defined
table structure, which does not have a password column.

#### Data Integrity

If we try to create a user that does not have an email via our api, we will get
an error message as before:

```
curl -H "Content-Type: application/json" -X POST -d '{"name":"Email Man"}' http://localhost:1337/users
```

However if we directly try to add a field into our DB with the email being NULL,
it is allowed:

```
INSERT INTO public.user (email) VALUES (NULL);
```

In our User model we have added the option `required: true` to the email
attribute. But all this does is create a server side validation and does not
add any databse constraints. To do this, we need to add a new option `notNull`
and set it to true:

```
module.exports = {
  attributes: {
    email: {
      type: 'string',
      required: true,
      notNull: true,
    }
  }
};
```

Retart sails. If you ran the insert command in postgres with the NULL value, you
should get an error message:

```
null value in column "email" violates not-null constraint
```

This is because if we were to change this constraint, we would have bad data.
Unlike NoSQL databases, RDBMSs focus on data integrity and consistency where
possible.

This issue is pretty simple to work around. Currently we just have one bad
record and we can manually delete it. But when you have to change a structure of
a table that has many records, and you are unable to validate each and every one
of those records, you have another choice. You can define a default value which
sets any row with the NULL column value to the specified default. This will also
set the column to the default value for any new row you create, if you do not
specify a value.


```
module.exports = {
  attributes: {
    email: {
      type: 'string',
      required: true,
      notNull: true,
      defaultsTo: "",
    }
  }
};
```

> If you do not want to have default value set but need to make sure all old
> records do not contain NULL values for the column, you can add this option
> migrate, and then remove the option, and migrate again. This is one way to
> avoid writing a query to update your records.
