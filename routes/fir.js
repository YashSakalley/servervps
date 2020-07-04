const express = require('express'),
    router = express.Router(),
    Fir = require('../models/Fir'),
    pdf = require('html-pdf');

const pdfTemplate = require('../document')

// Endpoint : '/firs/'

// Create FIR
router.post('/', (req, res) => {
    var sender = {
        name: 'Yash Sakalley',
        father_name: 'Arun Sakalley',
        address: '59, Bijli Colony, Bhopal',
        phone: '7974961262',
        email: 'yashsakalley98@gmail.com',
        id_proof: 'https://www.drupal.org/files/project-images/idproof.png'
    }

    var reciever = {
        name: 'Tony Stark',
        role: 'Station Head Officer',
        address: 'Anand Nagar'
    }

    var info = {
        sub: 'Theft in hostel in Indrapuri, Bhopal',
        place: 'Indrapuri',
        time: '2:30 PM, 04 July 2020',
        crime: 'Theft',
        property: 'Television, Cricket Bat',
        description_of_accussed: 'Tall, black hair, mark on forehead',
        witness_details: 'No witness',
        complaint: 'Theft occurred in Indrapuri where 2 thiefs took the red bus and fled'
    }

    var firId = '9err4648fvcmkidf';

    pdf.create(pdfTemplate(sender, reciever, info), {}).toFile(`document/saved/${firId}.pdf`, (err) => {
        if (err) {
            console.log(err);
            res.send(Promise.reject());
            return
        }
        res.send(`PDF Created ${firId}`);
    })
})

// READ
router.get('/', (req, res) => {
    Fir.find({})
        .then((firs) => {
            res.send({ status: 'success', firs: firs });
        })
        .catch((error) => {
            res.send({ status: 'error', msg: error });
        });
});

router.get('/:id', (req, res) => {
    Fir.findById(req.params.id)
        .then((fir) => {
            res.send({ status: 'success', fir: fir });
        })
        .catch((error) => {
            res.send({ status: 'error', msg: error });
        });
});

router.get('/user/:userId', (req, res) => {
    let userId = req.params.userId;
    if (!userId) {
        res.render({ status: 'error', msg: 'UserId not given' });
        return;
    }
    User.findById(userId)
        .then((user) => {
            firs = user.firs;
            var promises = firs.map(async (fir) => {
                const results = await fir.findById(fir)
                    .then((fir) => {
                        return fir;
                    })
                    .catch((error) => {
                        console.log(error);
                        res.send({ status: 'error', msg: error });
                    });
                return results;
            });
            Promise.all(promises).then(function (results) {
                console.log('results', results);
                res.send({ status: 'success', firs: results });
            });
        })
        .catch((error) => {
            console.log(error);
            res.send({ status: 'error', msg: error });
        });
});

router.get('/status/:status', (req, res) => {
    Fir.find({ status: req.params.status })
        .then((firs) => {
            res.send({ status: 'success', firs: firs });
        })
        .catch((error) => {
            res.send({ status: 'error', msg: error });
        });
});

// UPDATE
router.put('/:id', (req, res) => {
    res.send('Updated for id', req.params.id);
});

// DELETE
router.delete('/:id', (req, res) => {
    res.send('Deleted for id', req.params.id);
});
module.exports = router;