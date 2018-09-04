// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var orderSchema = new Schema({
    buyerId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    sellerId: {
        type: Schema.Types.ObjectId,
        required: true
    }, 
    postingId: {
        type: Schema.Types.ObjectId,
        required: true    
    },
    status: {
        type: String,
        enum: ['PENDING', 'FULFILLED', 'CANCELLED'],
        default: 'PENDING',
        required: true
    },
    txids: {
        type: [String]
    },
    created_at: Date,
    updated_at: Date
});

// on every save, add the date
orderSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
  
    // change the updated_at field to current date
    this.updated_at = currentDate;
  
    // if created_at doesn't exist, add to that field
    if (!this.created_at)
      this.created_at = currentDate;
  
    next();
  });

// the schema is useless so far
// we need to create a model using it
var Order = mongoose.model('Order', orderSchema);

// make this available to our users in our Node applications
module.exports = Order;