

const bcrypt = require('bcryptjs'); // Already there
const jwt = require('jsonwebtoken'); // Already there

// ADD THIS LINE
const { users, questions } = require('../model/index'); // Adjust path if your model file is elsewhere relative to the controller

const sendEmail = require('../utils/sendEmail');
const { where } = require('sequelize');


exports.renderHomePage = async(req, res) => {
const data= await questions.findAll({
    include:[{
    model: users, // Include the users model to get user details for each question
    attributes: ['username'] // Specify the attributes you want to retrieve from the users model
}]
})
//console.log(data); // Log the retrieved questions data to the console
    res.render('home', { data: data }); // Render the 'home' view
};

exports.renderRegisterPage = (req,res)=>{
    res.render('auth/register'); // Render the 'register' view
}

exports.handleRegister = async(req,res)=>{
    const {username,email,password}=req.body; // Destructure the request body to get username, email, and password
   // console.log(username, email, password); // Log the request body to the console
   if(!username || !email || !password){ // Check if any of the fields are empty
        return res.status(400).send("All fields are required!"); // If any field is empty, send a 400 status with an error message
    } 
    // Check if a user with the provided email already exists
    const data=await users.findAll({
        where: {
            email:email // Check if a user with the provided email already exists
        }
    })
    if(data.length > 0){ // If a user with the provided email already exists
        return res.status(400).send("User already exists!"); // Send a 400 status with an error message
    }
    await users.create({
        username,
        email,
        password : bcrypt.hashSync(password, 10) // Create a new user with the provided username, email, and password
    })
    res.redirect('/login'); // Redirect to the login page after successful registration    
}

exports.renderLoginPage = (req,res)=>{
    res.render('auth/login'); // Render the 'login' view
}

exports.handleLoginPage = async(req,res)=>{
    const {email,password}=req.body; // Destructure the request body to get email and password
    //console.log(email, password); // Log the request body to the console
if(!email || !password){ // Check if any of the fields are empty
    return res.status(400).send("All fields are required!"); // If any field is empty, send a 400 status with an error message
}
 //email check
  const [data]= await users.findAll({
    where: {
        email:email // Check if a user with the provided email exists
    }
  });
  if(data){
    //next check pw
   const isMatched= bcrypt.compareSync(password, data.password)
   if(isMatched){
    jwt.sign({id: data.id},'secretkey', {expiresIn: '1h'}, (err, token) => {
        if (err) return res.status(500).send("Error generating token");
    res.cookie('jwtToken', token, { httpOnly: true });
    
    res.redirect('/'); // Redirect to the home page after successful login
    });
   
   }
   else{
     res.send("Invalid password/email"); // If the password does not match, send an error message
   }
  }
  else{
    res.send("User not found");
  }
 // console.log(data); // Log the retrieved user data to the console

  // You may want to add password verification and response here
}
exports.renderForgotPasswordPage = (req, res) => {
    res.render('./auth/forgotPassword'); // Render the 'forgotPassword' view
};

exports.handleForgotPassword = async(req, res) => {
    const {email}=req.body; // Destructure the request body to get the email
    const data= await users.findAll({
    where: {
        email, // Check if a user with the provided email exists
    }
  })
   if (data.length === 0) {
        return res.status(400).send("User not found!");
    }

    // User exists, proceed to send OTP
    const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
console.log("Generated OTP:", otp); // Log the generated OTP for debugging
   try {
    await sendEmail({
        email: email,
        subject: "OTP for password reset",
        text: `Your OTP for password reset is ${otp}`
    });
} catch (err) {
    console.error("Error sending email:", err.message);
    return res.status(500).send("Failed to send OTP email.");
}

    data[0].otp = otp; // Set the generated OTP to the user's otp field
    data[0].otpGeneratedTime = Date.now(); // Set the current time as the OTP generation time
    await data[0].save(); // Save the updated user data with the OTP
    console.log(data[0].otp);

    res.redirect('/verifyOtp?email='+email); // Redirect to the verifyOtp page with the email as a query parameter
};

exports.renderVerifyOtpPage = (req, res) => {

    const email = req.query.email; // Get the email from the query parameter
    res.render('./auth/verifyOtp',{email:email}); // Render the 'verifyOtp' view
}

exports.verifyOtp=async(req,res)=>{

    const {otp}=req.body
    const email=req.params.email; // Get the email from the query parameter
    console.log(req.params.email); // Log the email to the console for debugging
  const data=await  users.findAll({
        where: {
            otp:otp, // Check if the provided OTP matches the user's OTP
            email:email // Check if a user with the provided email exists
        }
    })
    if(data.length === 0){ // If no user with the provided OTP and email exists
        return res.status(400).send("Invalid OTP or email!"); // Send a 400 status with an error message
    }
    const currentTime = Date.now(); // Get the current time in milliseconds
    const otpGeneratedTime = data[0].otpGeneratedTime
    // You may want to add OTP expiration logic here
    if(currentTime-otpGeneratedTime <=120000){
        console.log(otp)
        res.redirect(`/resetPassword?email=${email}&otp=${otp}`); // Redirect to the resetPassword page with the email as a query parameter
    }
    else{
        return res.status(400).send("OTP expired!"); // If the OTP has expired, send a 400 status with an error message
    }

}
exports.renderResetPasswordPage = (req, res) => {
    const{ email, otp } = req.query; // Get the email and OTP from the query parameters
console.log(email, otp); // Log the email and OTP to the console for debugging
    if (!email || !otp) {
        return res.status(400).send("Email and OTP are required! hawaaaaa"); // If email or OTP is missing, send a 400 status with an error message
    
    }
    res.render('./auth/resetPassword',{email,otp} ); // Render the 'resetPassword' view
}
exports.handleResetPassword = async(req, res) => {
    const{resetPassword, confirmPassword}=req.body; // Destructure the request body to get resetPassword and confirmPassword
    
    const { email, otp } = req.params; // Get the email and OTP from the request parameters
    console.log(email, otp, resetPassword, confirmPassword); // Log the email, OTP, resetPassword, and confirmPassword to the console for debugging
    if (!email || !otp || !resetPassword || !confirmPassword) { // Check if any of the fields are empty
        return res.status(400).send("Email and OTP are required!kk chaaa"); // If email or OTP is missing, send a 400 status with an error message
    }
    if (resetPassword !== confirmPassword) { // Check if the resetPassword and confirmPassword match
        return res.status(400).send("Passwords do not match!"); // If they do not match, send a 400 status with an error message
    }
    const userData=await users.findAll({
        where: {
            email: email, // Check if a user with the provided email exists
            otp: otp // Check if the provided OTP matches the user's OTP
        }
    })
    const currentTime = Date.now(); // Get the current time in milliseconds
    const otpGeneratedTime = userData[0].otpGeneratedTime; // Get the OTP
    if (currentTime - otpGeneratedTime > 120000) { // Check if the OTP has expired (2 minutes)
        return res.status(400).send("OTP expired!"); // If the OTP has expired, send a 400 status with an error message
    }
    else{
        await users.update(
            { password: bcrypt.hashSync(resetPassword, 10) }, // Update the user's password with the new password
            { where: { email: email} }
        )
        return res.redirect('/login'); // Redirect to the login page after successful password reset
    }
}


exports.logOut=(req, res) => {
    res.clearCookie('jwtToken'); // or your session/cookie logic
    // If you use sessions: req.session.destroy();
    res.redirect('/login');
}