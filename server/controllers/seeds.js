const faker = require('faker');
const User = require('../models').user
const Post = require('../models').post
const food = require('./food').food;
const foodPhotos = require('./food').foodPhotos;

module.exports = {
    seedDatabase(req, res) {
        try {
            // create 10 users
            let users = [];
            for(let i = 0; i < 10; i++) {
                let user = {
                    name: faker.name.findName(),
                    username: faker.internet.userName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    admin: false,
                    location: {
                        address: faker.address.streetAddress(),
                        state: faker.address.stateAbbr(),
                        country: faker.address.country(),
                        lng: faker.address.longitude(),
                        lat: faker.address.latitude()
                    },
                    ether_address: faker.finance.bitcoinAddress()
                }
                let newUser = new User(user);
                users.push(newUser);
                newUser.save();
            }

            console.log("length", users.length);

            // create 10 postings from each user
            for(let j = 0; j < 10; j++) {
                let user = users[j];
                for(let k = 0; k < 10; k++) {
                    let posting = {
                        name: food[Math.floor(Math.random()*100)],
                        price: Math.floor(Math.random()*10) + 5,
                        images: [foodPhotos[Math.floor(Math.random()*10)]],
                        description: faker.lorem.sentence(),
                        location: {
                            address: faker.address.streetAddress(),
                            state: faker.address.stateAbbr(),
                            country: faker.address.country(),
                            lng: faker.address.longitude(),
                            lat: faker.address.latitude()
                        },
                        userId: user._id
                    }
                    let newPosting = new Post(posting);
                    newPosting.save();
                }
            }

            res.send("database seeded");
        } catch(err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
}