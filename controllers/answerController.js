const { answers } = require("../model");

exports.handleAnswer = async (req, res) => {
    const { answerText } = req.body; // Destructure the request body to get the answer
    const questionId = req.params.id; // Get the question ID from the request parameters        
    console.log(req.params.id); // Log the question ID to the console
    const userId = req.userId; // Get the user ID from the request object
     if (!answerText) {
    return res.status(400).send("Answer text is required.");
   
      } await answers.create({
answerText, // Save the answer text in the database
userId,
questionId // Save the answer, user ID, and question ID in the database
    })
    res.redirect(`/questions/${questionId}`); // Redirect to the question page after submitting the answer
}