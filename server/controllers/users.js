const User = require('../models').user

module.exports = {
    create(req, res) {
        let name = req.body.name;
        let username = req.body.username;
        let password = req.body.password;

        var newUser = User({
            name: name,
            username: username,
            password: password,
            admin: false
        });  
        
        newUser.save(function(err) {
            if (err) {
                return res.status(500).send(err);
            } else {
                return res.send(newUser);
            }
        });
    },

    read(req, res) {
        User.find({}, function(err, users){
            if (err) {
                return res.status(500).send(err);
            } else {
                return res.send(users);
            }        
        })
    },

    update(req, res) {

        let id = parseInt(req.body.id);

        User.findById(id, function(err, user){
            if (err) {
                return res.status(500).send(err);
            } else {
                user.name = req.body.name || user.name
                user.username =  req.body.username || user.username
                user.password = req.body.password || user.password
                user.location = req.body.location || user.location
                user.ether_address = req.body.ether_address || user.ether_address

                user.save(function(err) {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.send(user);
                    }
                });
            }        
        })
    },

    delete(req,res) {
        let id = parseInt(req.body.id);

        // get the user starlord55
        User.findById(id, function(err, user) {
            if (err) {
                return res.status(500).send(err);
            } else {
                // delete him
                user.remove(function(err) {
                    if (err) {
                        return res.status(500).send(err);
                    } else {            
                        console.log('User successfully deleted!');
                        return res.send("User successfully deleted!")
                    }
                }); 
            }  
        });
    }


    
    
}