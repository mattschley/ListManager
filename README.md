Overview
=========

Funnelist is a web application to improve the functionality and usage of Twitter lists for journalists by providing an improved interface, analysis of a list's current users, and suggestions for new members. The project is a Node.js application using various modules (listed in package.json) and can be deployed on Heroku, where we are also using a MongoDB.

To best understand this application, you should:
- Read about the usage of Node + Express for web applications, as well as our other modules.
- Specifically, take a look at the documentation for Mustache templating to see how we built the front end
- Look through routes.js to see the different API/database calls we are making
- Play around with the [current version](http://funnelist.herokuapp.com)

This is a prototype and Work In Progress, so there are definitely improvements to be made in the code. 


Installation and Usage
=========

- Install Node.js and npm
- Clone this repository
- run npm install (possibly sudo npm install)
- Modify the different functions in routes.js (or possibly extract & require the code out into other .js files)
- Add additional metrics to metrics.js, and new suggestions to suggestions.js
- add the consumer and application keys for the Twitter profile you are using in routes.js
- Add new node modules to package.json
- Use the included Procfile to deploy to Heroku
- "foreman start web" will run a local version of your project


Development
=========

- Morgan is good for seeing the different server calls, but console.log will be your best friend