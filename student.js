// student.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name: {
        type: String,
    },
    school: {
        type: String
    }
});

module.exports = mongoose.model('Student', StudentSchema);