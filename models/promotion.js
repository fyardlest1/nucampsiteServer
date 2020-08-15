// Week 2 - Task 2
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    cost: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
);

// Create a Model named Promotion from the promotionSchema
const Promotion = mongoose.model('Promotion', promotionSchema);

// Export the Promotion Model from the module
module.exports = Promotion;