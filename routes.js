// const express = require('express');
// const app = express();

module.exports = function (app) {
    // the model
    const Student = require('./student');

    // ROUTES
    app.get('/', function(req, res) {
        Student.find(function(err, students) {
            if (err) res.send(err);
    
            var schools = students.map( (el) =>{
                return el.school;
            });
            let uniques = [...new Set(schools)];

            res.render('index.html', {locals: 
                { array: students , schools: uniques }
            });
        });
    });

    app.post('/students', function(req, res) {
        // console.log(req);
        if (req.body.name.length > 1 && req.body.school.length > 1) {
            var student = new Student();
            student.name = req.body.name;
            student.school = req.body.school;
    
            student.save(function(err) {
                if (err) 
                    res.send(err);
    
                // send JSON message through POSTMAN
                // res.json( { message: "Student saved." });
                console.log('New user saved.');
            });
        res.redirect('/'); // will list all the students again
    }});

    app.post('/delete', function(req, res) {
        var idToDelete = req.body.id;
        Student.findOneAndDelete({_id: idToDelete}, function(err, student) {
            if (err)
                res.send(err);
    
            // res.send(student); // returning the student who was delted
            console.log('Student deleted.'); 
        });
        res.redirect('/');
    });
    
    app.post('/update', function(req, res) {
        var idToUpdate = req.body.id;

        Student.findOneAndUpdate(
            { "_id": idToUpdate },
            { "name": req.body.newName, "school": req.body.newSchool },
            function(err, student) {
                if (err) throw err;
    
                console.log('Student updated.');
            }
        );
        res.redirect('/');
    });

}


