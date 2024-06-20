const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();

// Define the Mongoose Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email:{
        typr:String
    }
});

// Create the Mongoose Model
const UserModel = mongoose.model("User", userSchema);

app.use(express.static('public')); // Assuming your CSS file is in a folder named 'public'

// Convert data into JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve CSS file
app.get('/style2.css', (req, res) => {
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/public/style2.css');
});

// Use ejs as view engine
app.set('view engine', 'ejs');

app.get('/login', (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup")
});

// Handle signup form submission
app.post("/signup", async (req, res) => {
    try {
        const existingUser = await UserModel.findOne({ name: req.body.username });
        if (existingUser) {
            res.send("User already exists. Please choose a different username.");
        } else {
            //hashing password using bcrypt
            const saltRounds = 10;
            const hashedpassword = await bcrypt.hash(req.body.password, saltRounds);

            const userData = {
                name: req.body.username,
                password: hashedpassword,
            };
            const newUser = await UserModel.create(userData);
            console.log("New user created:", newUser);
            res.redirect("http://127.0.0.1:5500/index.html");
        }
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
    }
});
//login user
app.post("/login", async (req, res) => {
    try {
        const user = await UserModel.findOne({ name: req.body.username });
        if (!user) {
            res.send("Username not found.");
            return;
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordMatch) {
            // Redirect to the home page (expense tracker page)
            res.redirect("http://127.0.0.1:5500/index.html");
        } else {
            res.send("Wrong password.");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in.");
    }
});
    
//check if user already exist in database
const port = 5000;

mongoose.connect("mongodb://localhost:27017/project1")
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });




//*******************************************************************************************


// const express = require("express");
// const mongo = require("mongoose");
// const path = require("path");
// const bcrypt = require ("bcrypt");
// const app = express();
// const collection = require("./public/config");
// app.use(express.static('public')); // Assuming your CSS file is in a folder named 'public'

// //convert data into json
// app.use(express.json());
// app.use(express.urlencoded({extended:false}));

// app.get('/style2.css', (req, res) => {
//     res.header("Content-Type", "text/css");
//     res.sendFile(__dirname + '/public/style2.css');
// });

// //use ejs as view engine
// app.set('view engine', 'ejs');

// app.use(express.static("public"))

// app.get('/',(req, res)=>{
//     res.render("login");
// });
// app.get("/signup",(req, res)=>{
//     res.render("signup")
// })
// app.post("/signup", async (req, res) => {
//     const userData = {
//         name: req.body.username,
//         password: req.body.password,
//     };
//     try {
//         const newUser = await userSchema.create(userData);
//         console.log("New user created:", newUser);
//         res.redirect("/"); // Redirect to login page after successful signup
//     } catch (error) {
//         console.error("Error creating user:", error);
//         res.status(500).send("Internal Server Error"); // Handle error gracefully
//     }
// });

// const port = 5000;
// app.listen(port,()=>{
//     console.log(`server running on port ${port}`)
// })