var express = require('express'),
    router = express.Router(),
    path = require('path'),
    multer = require('multer'),
    Aadhaar = require('../models/Aadhaar'),
    pdf = require('html-pdf');

const exec = require('child_process').exec;

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
            question: 'What did the accused look like in his/her appearance',
            suggestions: ['Don\'t remember', 'Prefer not to say']
        },
        {
            label: 'witness_details',
            question: 'Were there any witness for the crime',
            suggestions: ['Don\'t remember', 'Prefer not to say']
        },
        {
            label: 'complaint',
            question: 'Please give a brief summary of your complaint in 20-30 words',
            suggestions: []
        }
    ]
    res.send({ status: 'success', questions: questions });
});

router.get('/getPdf/:id', (req, res) => {
    let path = require('path').resolve(__dirname, '..', 'document', 'saved', req.params.id)
    console.log(path)
    res.sendFile(path + '.pdf')
})

router.get('/getFile/:id', (req, res) => {
    let path = require('path').resolve(__dirname, '..', 'document', 'uploads', req.params.id)
    console.log(path)
    res.sendFile(path)
})

router.get('/getSuspectImg/:id/:num', (req, res) => {
    console.log('rreee');
    let num = req.params.num
    let path = require('path').resolve(__dirname, '..', 'document', 'images', req.params.id, `Suspect-${num}.jpg`)
    console.log(path)
    res.sendFile(path)
})

router.post('/entity', (req, res) => {
    let desc = req.body.desc
    exec(`python EntityRecognition_spacy.py ${desc}`, (err, stdout, stderr) => {
        if (err) {
            console.log(err)
            res.send({ status: 'error', msg: err });
        } else {
            res.send({ status: 'success', entity: stdout })
            console.log('STDERR', stderr);
        }
    })
})

router.post('/ipc', (req, res) => {
    let desc = req.body.desc
    exec(`python law_detection.py ${desc}`, (err, stdout, stderr) => {
        if (err) {
            console.log(err)
            res.send({ status: 'error', msg: err });
        } else {
            let out = stdout.split('\n')
            let arr = []
            out.forEach(o => {
                arr.push(o.split(' '))
            })
            arr = arr.slice(0, arr.length - 2)
            res.send({ status: 'success', entity: arr })
            console.log('STDERR', stderr);
        }
    })
})

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

const pdfTemplate = require('../document/testTemplate')

// Development Only - Create PDF
router.post('/devPdf', (req, res) => {

    let signature = 'Signature.jpeg';
    pdf.create(pdfTemplate(signature), {
        base: 'file://' + path.resolve('./public') + '/'
    }).toFile(`document/saved/test.pdf`, (err) => {
        if (err) {
            console.log(err)
            res.send('error')
        } else {
            res.send('success')
        }
    })
})
module.exports = router;
