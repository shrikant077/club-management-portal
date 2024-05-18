const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
    eventname:{
        type: String
    },
    club: {
        type: String        
    }, 
    venue: {
        type: String        
    },
    date: {
        type: String        
    },
    timeslot: {
        type: String
    }
})

module.exports = mongoose.model("Records", recordSchema);