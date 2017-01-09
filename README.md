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




