// require controllers here

const usersController = require('../controllers').users
const postsController = require('../controllers').posts

module.exports = (app) => {
    // define all routes here
    
    // users
    app.post('/api/user', usersController.create);
    app.get('/api/users', usersController.read);
    app.post('/api/user/update', usersController.update);
    app.post('/api/user/delete', usersController.delete);
    app.get('/api/user/:id', usersController.findById);

    // posts
    app.post('/api/post', postsController.create);
    app.get('/api/posts', postsController.read);
    app.post('/api/post/update', postsController.update);
    app.post('/api/post/delete', postsController.delete);
    app.get('/api/post/:id', postsController.findById);

}