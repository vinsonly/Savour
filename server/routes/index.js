// require controllers here

const usersController = require('./controllers').users

module.exports = (app) => {
    // define all routes here
    
    // user
    app.post('/api/users', usersController.create);
    app.get('/api/users', usersController.read);
    app.post('/api/users', usersController.update);
    app.post('/api/users', usersController.delete);
}