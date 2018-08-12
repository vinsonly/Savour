// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var postSchema = new Schema({
  name: {
      type: String,
      maxlength: 200,
      required: true,
  },
  price: {
      type: Schema.Types.Decimal128,
      min: 0,
      required: true
  },
  images: {
    type: [String],
    require: true
  }, // array of links to the img
  description: {
      type: String,
      maxlength: 500,
  },
  location: {
    address: String,
    state: String,
    country: String,
    lng: String,
    lat: String
  },
  userId: {
    type: String,
    require: true
  },
  created_at: Date,
  updated_at: Date
});

// on every save, add the date
postSchema.pre('save', function(next) {
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
var Post = mongoose.model('Post', postSchema);

// make this available to our users in our Node applications
module.exports = Post;