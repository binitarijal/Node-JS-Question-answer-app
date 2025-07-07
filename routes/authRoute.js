
const { handleRegister, renderRegisterPage, handleLoginPage, renderLoginPage, renderHomePage, renderForgotPasswordPage, handleForgotPassword, renderVerifyOtpPage, logOut, verifyOtp, renderResetPasswordPage, handleResetPassword } = require("../controllers/authController")
const catchError = require("../utils/catchError")

const router=require("express").Router()

router.route('/register').post(handleRegister).get(renderRegisterPage)

router.route('/home').get(renderHomePage)
router.route('/login').post(catchError(handleLoginPage)).get(catchError(renderLoginPage))

router.route("/forgotPassword").get(catchError(renderForgotPasswordPage)).post(catchError(handleForgotPassword))
router.route("/verifyOtp").get(catchError(renderVerifyOtpPage))
router.route("/verifyOtp/:email").post(catchError(verifyOtp))
router.route("/resetPassword").get(catchError(renderResetPasswordPage))
router.route("/resetPassword/:email/:otp").post(catchError(handleResetPassword))
router.route("/logout").get(catchError(logOut))
module.exports=router