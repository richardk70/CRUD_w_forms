// student.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    school: {
        type: String,
        required: false,
        trim: true,
        unique: false
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
});

// encrypt password before save
// StudentSchema.pre('save', function(next) {
//     const student = this;
//     if (!student.isModified || !student.isNew) { // don't rehash if its an old user
//         next(); 
//     } else {
//         bcrypt.hash(student.password, stage.saltingRounds, function (err, hash) {
//             if (err) throw err;

//             student.password = hash;
//             next();
//         });
//     }
// });

module.exports = mongoose.model('User', UserSchema);