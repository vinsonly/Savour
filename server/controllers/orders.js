const Post = require('../models').post
const User = require('../models').user

module.exports = {
    create(req, res) {

        // find seller id from posting id

        Post.findById(postingId, function(err, post) {
            if(err || !post) {
                return res.status(404).send({
                    message: `Cannot find post with id: ${postingId}`
                });
            } else {
                var newOrder = Post({
                    buyerId: req.body.validatedUser._id,
                    sellerId: post.userId,
                    postingId: req.body.postingId,
                    status: 'PENDING'
                }); 
                
                if(req.body.txids) {
                    newOrder.txids = req.body.txids
                }

                console.log(newOrder);

                newOrder.save(function(err) {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.status(201).send(newOrder);
                    }
                });
            }
        });

    },

    read(req, res) {
        Order.find({}, function(err, orders){
            if (err) {
                return res.status(500).send(err);
            } else {
                return res.send(orders);
            }        
        })
    },

    update(req, res) {
        let id = req.body.id;
        let body = req.body;
        let status = req.body.status;
        let txids = req.body.txids;

        Order.updateOne({ _id: id }, { 
            $set: {
                status: status
            },
            $addToSet: {
                txids: { $each: txids }
            }
        }, function(err, raw) {
            if (err) {
                return res.status(400).send(err);
            } else {
                return res.send(raw);
            }
        });
    },

    delete(req,res) {
        let id = req.body.id;

        // get the post starlord55
        Order.findById(id, function(err, order) {
            if (err) {
                return res.status(404).send({
                    message: `Cannot find order with id: ${id}`
                });            
            } else {
                // delete order
                order.remove(function(err) {
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

        Order.findById(id, function(err, order) {
            if (err) {
                console.log(err);
                return res.status(404).send({
                    message: `Cannot find order with id: ${id}`
                });
            } else {
                return res.send(order);
            }          
        })
    },

    getBuyerOrders(req, res) {
        let buyerId = req.params.buyerId;

        User.findById(buyerId, function(err, user) {
            if(err || !user) {
                return res.status(404).send({
                    message: `Cannot find user with id: ${id}`
                });
            } else {
                // find all orders where the user is a buyer
                Order.find({ buyerId: buyerId }, function(err, orders) {
                    if(err) {
                        return res.status(500).send(err); 
                    } else {
                        return res.send(orders);
                    }
                })
            }
        })
    },

    getSellerOrders(req, res) {
        let sellerId = req.params.sellerId;

        User.findById(sellerId, function(err, user) {
            if(err || !user) {
                return res.status(404).send({
                    message: `Cannot find user with id: ${id}`
                });
            } else {
                // find all orders where the user is a buyer
                Order.find({ sellerId: sellerId }, function(err, orders) {
                    if(err) {
                        return res.status(500).send(err); 
                    } else {
                        return res.send(orders);
                    }
                })
            }
        })
    }
    
    
}