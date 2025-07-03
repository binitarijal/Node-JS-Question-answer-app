const jwt=require('jsonwebtoken'); // Import the jsonwebtoken library for token verification
const {promisify} = require('util'); // Import the promisify function from the util module
const { users } = require('../model');
exports.isAuthenticated = async(req, res, next) => {
    const token= req.cookies.jwtToken; // Get the JWT token from cookies
    console.log(token); // Log the token to the console for debugging
    if(!token  || token === undefined || token===null){ // Check if the token is not present or is undefined
        return res.redirect('/login'); // If no token is found, redirect to the login page

    }
    // jwt.verify(token, 'secretkey', (err, result) => {
    //     if (err) {
    //         return res.redirect('/login'); // If token is invalid, redirect to login
    //     }
    //     next(); // If token is valid, proceed to next middleware
    // });


    //another way to verify token
 const decryptedResult=await  promisify(jwt.verify)(token, 'secretkey')
console.log(decryptedResult); // Log the decrypted result to the console
if(!decryptedResult){ // If the decrypted result is falsy, redirect to login
    return res.redirect('/login'); // Redirect to the login page    
} 
//for extra security, you can check if the user exists in the database
const user=await users.findByPk(decryptedResult.id); // Find the user by primary key (id) from the decrypted result
if(!user){ // If the user does not exist, redirect to login  
    return res.redirect('/login'); // Redirect to the login page
}
req.userId=decryptedResult.id; // Set the userId in the request object for further use
next()
}