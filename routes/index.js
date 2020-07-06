var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    Aadhaar = require('../models/Aadhaar');

// Endpoint : '/'

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

var upload = multer({ storage: storage }).array('file')

router.get('/', (req, res) => {
    res.send('I am Inevitable');
});

router.post('/upload', (req, res) => {
    upload(req, res, function (err) {

        if (err) console.log(err);

        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        console.log('File uploaded');
        return res.status(200).send(req.file)

    })
})

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