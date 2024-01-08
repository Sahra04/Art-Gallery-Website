const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ArtSchema = Schema({
    title:{
        type: String,
        required: true
    }, 
    artist: {
        type: String,
        required: true
    }, 
    year: {
        type: String,
        required: true
    }, 
    category: {
        type: String,
        required: true
    },
    medium: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        default: ''

    },
    poster: {
        type: String, 
        required: true 
    }, 
    likes:{
        type: Number,
        default:0

    },
    reviews:{
        type: Array, 
        default: []

    }
    

}); 

module.exports = mongoose.model("Artwork", ArtSchema);