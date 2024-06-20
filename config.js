const { error } = require("console");
const mongoose = require("mongoose")
const connect = mongoose.connect("mongodb://localhost:27017/project1")
connect.then(()=>{
    console.log("connection established")
}).catch((console.error(error)
));
let userSchema= new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require:true
    }
})
const collection = new mongoose.model("users", userSchema);
mongoose.model.export= collection;