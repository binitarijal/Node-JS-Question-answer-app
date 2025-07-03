const router=require("express").Router();

const {multer, storage} = require('../middleware/multerConfig'); // Import the multer library for handling file uploads
const upload = multer({ storage: storage }); // Configure multer with the specified storage settings

const { renderAskQuestionPage, askQuestion, renderSingleQuestionPage } = require("../controllers/questionController");
const { isAuthenticated } = require("../middleware/isAuthenticated");

router.route('/askQuestion').post( isAuthenticated,  upload.single('image'),askQuestion).get(renderAskQuestionPage);
router.route('/questions/:id').get( renderSingleQuestionPage); // Route to render a single question page
module.exports=router;