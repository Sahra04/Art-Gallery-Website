const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = Schema({
    username:{
        type: String, 
        default: 'username'
    }, 
    password: {
        type: String,
        default: 'password'
    }, 
    following :{
        type: Array,
        default: [], 
    },
    reviewed:{
        type: Array,
        default: []
       
    },
    liked:{
        type: Array,
        default: []
    },
    notification:{
        type: Array,
        default: []
    }, 
    artist:{
        type: Boolean,
        default: false
    },
    artpieces:{ 
        type: Array,
        default: []
    },
    workshops:{
        type: Array,
        default: []
    }, 
    followers:{
        type: Array,
        default: []
    }
   

}); 

module.exports = mongoose.model("User", UserSchema);