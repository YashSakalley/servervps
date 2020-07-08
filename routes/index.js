var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    Aadhaar = require('../models/Aadhaar');

// Endpoint : '/'

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'document/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

var upload = multer({ storage: storage }).single('file')

router.get('/', (req, res) => {
    res.send('I am Inevitable. And I .. am .... Iron Man 😎');
});

router.post('/upload/', (req, res) => {
    console.log(req.body);

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json(err)
        } else if (err) {
            console.log(err);
            return res.status(500).json(err)
        }
        console.log('file uploaded', req.file);

        return res.status(200).send({ status: 'success', file: req.file })

    })
})

router.get('/questions/:crime', (req, res) => {
    console.log('Request for questions for crime: ' + req.params.crime);
    var questions = [
        {
            label: 'sub',
            question: 'Please enter subject for your report. (Eg. Theft in Titan Store, Bhopal)',
            suggestions: []
        },
        {
            label: 'place',
            question: 'Enter place of crime',
            suggestions: []
        },
        {
            label: 'time',
            question: 'Enter time and date of incident (MM:SS AM/PM, DD MMMM YYYY)',
            suggestions: []
        },
        {
            label: 'property',
            question: 'Was there any property damaged or stolen',
            suggestions: ['No']
        },
        {
            label: 'description_of_accussed',
            question: 'What did the accussed look like in his/her appearance',
            suggestions: ['Don\'t remember', 'Prefer not to say']
        },
        {
            label: 'witness_details',
            question: 'Were there any witness for the crime',
            suggestions: ['Don\'t remember', 'Prefer not to say']
        },
        {
            label: 'complaint',
            question: 'Please give a breif summary of your complaint in 20-30 words',
            suggestions: []
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