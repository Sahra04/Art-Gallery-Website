
Description: 
- A social-media inspired website that is target towards artists

how to run: 
- Download zip file
- Unzip file
- Open file in the same directory
- Run npm install, in order to install all node modules
- Type node database-initializer.js
- This is where you initialize the database, make sure to press ctrl c, when database
is successfully created all objects
- Then type node server.js
- This is to start the server
- After explore the site!

Files:
- public: contains art, css, js, views files
- art: contains gallery.json, where database-initializer.js reads from these files and
initializes them in database
- css: for styling and the layout of my website
- js: a client, that sends GET, POST requests to the server to communicate with the server,
browser, and database
- views: contains pages and partials files
- pages: contains pug templates that are displayed in the browser
- partials: contains partial pug templates that are used in pages
- ArtworkModel.js: artwork scheme for database (part of the UserModel.js)
- UserModel.js: patron/artist scheme for database
- WorkshopModel.js: workshop scheme for database (part of the UserModel.js)
- (part of the UserModel.js)
- package.json: where you install all node modules by typing “npm install”
- server.js: where multiple clients can run on, and communicate through the database with
it

