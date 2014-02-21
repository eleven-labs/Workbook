Workbook
========

Workbook is a relational intranet. It allows employees of a company to search and list quickly their colleagues. A newsfeed also enables him to be aware of various events planned by the company or its employees.

----------

Functional overview
--------------------------

- Authentication Required
- Access to four pages
  - Tables of activities
    - List of users and administrators messages
    - Ability to write a message
    - Ability to comment and like
  - Profile Search
    - Search on personal details
  - Mapping Contributors
    - Gmap map to display the location of all missions and residences
  - Edition of personal data
    - Photo
    - First
    - Name
    - Address of the mission
    - Home address ( Optional )
    - Technologies of choice
    - Social Links ( github , facebook, Viadeo , ... )

Technical directive
--------------------------

- Development of a front and a back (API)
- Front Application
  - Framework AngularJs
  - Bootstrap CSS Framework
  - Deployment helped by grunt and bower
- Back Application (API)
  - Http server node.js
  - Framework express.js
  - Database MongoDB ( but also an opportunity to head next on graph databases as Neo4j and full text search as ElasticSearch )
  - Authentication with passportJs
  - Management of profile pictures by jQuery-File-Upload
  - Mapping addresses with GMaps Api
- Project management on Github
- Deploying and testing online via Heroku

Installation
------------

### Platform & tools

You need to install Node.js and then the development tools. Node.js comes with a package manager called [npm](http://npmjs.org) for installing NodeJS applications and libraries.
* [Install node.js](http://nodejs.org/download/) (requires node.js version >= 0.8.4)
* Install Grunt-CLI and Karma as global npm modules:

    ```
    npm install -g grunt-cli karma
    ```

(Note that you may need to uninstall grunt 0.3 globally before installing grunt-cli)

### Get the Code

Either clone this repository or fork it on GitHub and clone your fork:

```
git clone https://github.com/eleven-labs/Workbook.git
cd Workbook
```

### App Server

Our backend application server is a NodeJS application that relies upon some 3rd Party npm packages.  You need to install these:

* Install local dependencies (from the project root folder):

    ```
    cd server
    npm install
    cd ..
    ```

  (This will install the dependencies declared in the server/package.json file)

### Client App

Our client application is a straight HTML/Javascript application but our development process uses a Node.js build tool
[Grunt.js](gruntjs.com). Grunt relies upon some 3rd party libraries that we need to install as local dependencies using npm.

* Install local dependencies (from the project root folder):

    ```
    cd client
    npm install
    bower install
    cd ..
    ```

  (This will install the dependencies declared in the client/package.json file)
  
## Building

### Configure Server

* Install mongo and run our initialization script to initialize the database with a first admin user.

```
cd server
node scripts/create-admin-user.js --email=my@email.com --password=workbook --admin=1 --firstName=Admin --lastName=User --status=consultant --validated=1
```

### Build the client app
The app made up of a number of javascript, css and html files that need to be merged into a final distribution for running.  We use the Grunt build tool to do this.
* Build client application: 
    
    ```
    cd client
    grunt build
    cd ..
    ```

*It is important to build again if you have changed the client configuration as above.*

## Running
### Start the Server
* Run the server

    ```
    cd server
    sudo -E node server.js
    cd ..
    ```
* Browse to the application at [http://localhost:3000]

## Browser Support
We only regularly test against Chrome 29 and occasionally against Firefox and Internet Explorer.
The application should run on most modern browsers that are supported by the AngularJS framework.
Obviously, if you chose to base your application on this one, then you should ensure you do your own
testing against browsers that you need to support.

## Development

### Folders structure
At the top level, the repository is split into a client folder and a server folder.  The client folder contains all the client-side AngularJS application.  The server folder contains a very basic Express based webserver that delivers and supports the application.
Within the client folder you have the following structure:
* `build` contains build tasks for Grunt
* `dist` contains build results
* `src` contains application's sources
* `test` contains test sources, configuration and dependencies
* `vendor` contains external dependencies for the application

### Default Build
The default grunt task will build (checks the javascript (lint), runs the unit tests (test:unit) and builds distributable files) and run all unit tests: `grunt` (or `grunt.cmd` on Windows).  The tests are run by karma and need one or more browsers open to actually run the tests.
* `cd client`
* `grunt`
* Open one or more browsers and point them to [http://localhost:8080/__test/].  Once the browsers connect the tests will run and the build will complete.
* If you leave the browsers open at this url then future runs of `grunt` will automatically run the tests against these browsers.

### Continuous Building
The watch grunt task will monitor the source files and run the default build task every time a file changes: `grunt watch`.

### Build without tests
If for some reason you don't want to run the test but just generate the files - not a good idea(!!) - you can simply run the build task: `grunt build`.

### Building release code
You can build a release version of the app, with minified files.  This task will also run the "end to end" (e2e) tests.
The e2e tests require the server to be started and also one or more browsers open to run the tests.  (You can use the same browsers as for the unit tests.)
* `cd client`
* Run `grunt release`
* Open one or more browsers and point them to [http://localhost:8080/__test/].  Once the browsers connect the tests will run and the build will complete.
* If you leave the browsers open at this url then future runs of `grunt` will automatically run the tests against these browsers.

### Continuous testing
You can have grunt (karma) continuously watch for file changes and automatically run all the tests on every change, without rebuilding the distribution files.  This can make the test run faster when you are doing test driven development and don't need to actually run the application itself.

* `cd client`
* Run `grunt test-watch`.
* Open one or more browsers and point them to [http://localhost:8080/__test/].
* Each time a file changes the tests will be run against each browser.
