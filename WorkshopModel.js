const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let WorkshopSchema = Schema({
    title:{
        type: String,
        required: true
    }, 
    artist: {
        type: String,
        required: true
    }, 
    enrolled: {
        type: Array,
        default: []
    }
    
}); 

module.exports = mongoose.model("Workshop", WorkshopSchema);