// Week 2 - Task 1
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partnerSchema = new Schema(
    {
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
        description: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

// Create a Model named Partner from the partnerSchema
const Partner = mongoose.model('Partner', partnerSchema);

// Export the Partner Model from this module
module.exports = Partner;