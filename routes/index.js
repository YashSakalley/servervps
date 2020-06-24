var express = require('express'),
    router = express.Router(),
    Aadhaar = require('../models/Aadhaar');

// Endpoint : '/'


router.get('/', (req, res) => {
    res.send('I am Inevitable');
});

router.get('/questions/:crime', (req, res) => {
    console.log('Request for questions for crime: ' + req.params.crime);
    var questions = [
        {
            question: 'Do you recognise the individual involved',
            suggestions: ['No', 'Yes', 'Don\'t remember']
        },
        {
            question: 'How many were involved',
            suggestions: ['Only 1', '0', 'Don\'t remember']
        },
        {
            question: 'What kind of weapons used, if any?',
            suggestions: ['Knife', 'Gun', 'Don\'t remember']
        },
        {
            question: 'When and where',
            suggestions: ['Don\'t know']
        }
    ]
    res.send({ status: 'success', questions: questions });
});

// Development Only - Create Aadhaar Data
router.post('/addAadhaarData', (req, res) => {
    var aadhaar = new Aadhaar({
        phone: req.body.phone,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        uid: req.body.uid,
        father_name: req.body.father_name,
        address: req.body.address
    });

    aadhaar.save((err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.send('Document saved');
        }
    });
});

module.exports = router;