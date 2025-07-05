
const { handleRegister, renderRegisterPage, handleLoginPage, renderLoginPage, renderHomePage, renderForgotPasswordPage, handleForgotPassword, renderVerifyOtpPage, logOut, verifyOtp, renderResetPasswordPage, handleResetPassword } = require("../controllers/authController")

const router=require("express").Router()

router.route('/register').post(handleRegister).get(renderRegisterPage)

router.route('/home').get(renderHomePage)
router.route('/login').post(handleLoginPage).get(renderLoginPage)

router.route("/forgotPassword").get(renderForgotPasswordPage).post(handleForgotPassword)
router.route("/verifyOtp").get(renderVerifyOtpPage)
router.route("/verifyOtp/:email").post(verifyOtp)
router.route("/resetPassword").get(renderResetPasswordPage)
router.route("/resetPassword/:email/:otp").post(handleResetPassword)
router.route("/logout").get(logOut)
module.exports=router