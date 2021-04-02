const mongoose = require('mongoose');
const QuestionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    question: {
        type: String,
        default: true
    }
});

const Question= mongoose.model('Question', QuestionSchema);
module.exports = Question;
