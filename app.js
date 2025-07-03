const express=require('express'); // Import the Express framework 
const { users } = require('./model/index');
const app=express() // Create an Express application
//app here is an object that has methods for routing HTTP requests, middleware, and more.
 require("./model/index"); // Import the database models
const bcrypt = require('bcryptjs'); // Import the bcrypt library for hashing passwords
const { where } = require('sequelize');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library for token generation
const { promisify } = require('util'); // Import the promisify function from the util module
const cookieparser = require('cookie-parser'); // Import the cookie-parser middleware for parsing cookies
const { renderHomePage, renderRegisterPage, handleRegister, renderLoginPage, handleLoginPage } = require('./controllers/authController');

const authRoute=require('./routes/authRoute'); // Import the authentication routes
const questionRoute=require('./routes/questionRoute'); // Import the question routes
const answerRoute=require('./routes/answerRoute'); // Import the answer routes
app.set('view engine','ejs'); // Set the view engine to EJS



app.use(express.urlencoded({extended:true})); // Middleware to parse URL-encoded bodies
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieparser()); // Middleware to parse cookies


app.use(async(req,res,next)=>{ // Middleware to handle requests
const token= req.cookies.jwtToken; // Get the token from cookies
//console.log(token); // Log the token to the console
if(!token  || token === undefined || token===null){ // Check if the token is not present or is undefined
    res.locals.isAuthenticated=false; // If no token is found, set isAuthenticated to false
    return next(); // Proceed to the next middleware
}
try{
const decryptedResult=await  promisify(jwt.verify)(token, 'secretkey')

 if(decryptedResult){
    res.locals.isAuthenticated=true; // If the token is valid, set isAuthenticated to true
}else{
    res.locals.isAuthenticated=false; // If the token is invalid, set isAuthenticated to false
}
}
catch(err){
        res.locals.isAuthenticated=false; // If the token is invalid, set isAuthenticated to false

}

next()

})
app.get('/', renderHomePage);


 


app.use("/", authRoute); // Use the authentication routes
app.use("/", questionRoute); // Use the question routesapp.use("/", answerRoute); // Use the answer routes
app.use("/answer", answerRoute); // Use the answer routes
app.use(express.static('./storage/')); // Serve static files from the 'public' directory
app.use(express.static('public/css/')); // Serve static files from the 'public' directory
const port=3001

app.listen(port,()=>{
    console.log("Server is running on port "+ port);
})