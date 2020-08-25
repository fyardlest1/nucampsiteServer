const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    campsites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campsite'
    }]
}, {
    timestamps: true
});

// Create a Model named Favorite from the favoriteSchema
const Favorite = mongoose.model('Favorite', favoriteSchema);

// Export the Favorite Model from this module
module.exports = Favorite;