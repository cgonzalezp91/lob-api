# LOB RESTful API

This is just a small RESTful API for a study case.

It is made with [Express](https://expressjs.com/) and modules of ES6, and for dev dependencies I have [babel](https://babeljs.io/) for complie ES6 modules and [Nodemo](https://nodemon.io/) for quick and easy live reload

For testing we use [Jest](https://jestjs.io/) and [Supertest](https://www.npmjs.com/package/supertest).

## Testing and Debugging

In order to start the application you can run `npm start` and `npm run debug` in both commands we are enabling the experimental flag `--experimental-json-modules` to work with JSON files on ES6 modules

* `npm start`: Is going to run the API with nodemon and execute babel-node to complie the code, and enabling the experimental flag 
* `npm run debug`: Is going to run Express in debug mode as well as run nodemon for the live reload

