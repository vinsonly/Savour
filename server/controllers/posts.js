const Post = require('../models').post
const User = require('../models').user


module.exports = {
    create(req, res) {

        // convert the price from the browser to number rounded to two decimal places
        let price = parseFloat(req.body.price);
        price = Math.round(price * 100)/100;

        // body.location = JSON.parse(req.body.location);
        
        let name = req.body.name;
        let images = req.body.images;
        let description = req.body.description;
        let location = JSON.parse(req.body.location);
        let userId = req.body.userId;

        // console.log("req.body", req.body);

        var newPost = Post({
            name: name,
            images: images,
            price: price,
            description: description,
            location: location,
            userId: userId
        });  

        console.log(newPost);

        User.findById(userId, function(err, user){
            if (err) {
                return res.status(404).send({
                    message: `Cannot find user with id: ${id}`
                }); 
            } else {
                newPost.save(function(err) {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.status(201).send(newPost);
                    }
                });
            }
        });
    },

    read(req, res) {
        Post.find({}, function(err, posts){
            if (err) {
                return res.status(500).send(err);
            } else {
                return res.send(posts);
            }        
        })
    },

    update(req, res) {

        let id = req.body.id;

        let body = req.body;
        body.location = JSON.parse(req.body.location);
        console.log("req.body.location", req.body.location);


        Post.findById(id, function(err, post){
            if (err) {
                return res.status(500).send(err);
            } else {
        
                for(key in post) {
                    if(key == "name" || 
                    key == "images" ||
                    key == "price" ||
                    key == "description" ||
                    key == "location") {
                        post[key] = body[key] || post[key]
                    }
                }

                post.save(function(err) {
                    if (err) {
                        return res.status(400).send(err);
                    } else {
                        return res.send(post);
                    }
                });
            }        
        })
    },

    delete(req,res) {
        let id = req.body.id;

        // get the post starlord55
        Post.findById(id, function(err, post) {
            if (err) {
                return res.status(404).send({
                    message: `Cannot find post with id: ${id}`
                });            
            } else {
                // delete post
                post.remove(function(err) {
                    if (err) {
                        return res.status(500).send(err);
                    } else {            
                        return res.send("Post successfully deleted.")
                    }
                }); 
            }  
        });
    },

    findById(req, res) {
        let id = req.params.id;

        Post.findById(id, function(err, post) {
            if (err) {
                console.log(err);
                return res.status(404).send({
                    message: `Cannot find post with id: ${id}`
                });
            } else {
                return res.send(post);
            }          
        })
    }


    
    
}