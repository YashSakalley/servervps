const express = require('express'),
    router = express.Router(),
    Volunteer = require('../../models/Volunteer'),
    FaciliRequest = require('../../models/FaciliRequest');

// Endpoint : '/volunteer/'

/* REQUEST */

// CREATE
router.post('/request/create', (req, res) => {
    let { lat, lng, phone } = req.body;

    var request = new FaciliRequest({
        lat,
        lng,
        phone,
        status: 'Pending'
    })
    request.save()
        .then((request) => {
            console.log(request);
            res.send({ status: 'success', request: request })
        })
        .catch((err) => {
            console.log(err);
            res.send({ status: 'error' })
        })
})

// READ
router.get('/request', (req, res) => {
    FaciliRequest.find({})
        .then((requests) => {
            res.send({ status: 'success', requests: requests })
        })
        .catch((err) => {
            console.log(err);
            res.send({ status: 'error', msg: err })
        })
})

router.get('/request/:id', (req, res) => {
    FaciliRequest.findById(req.params.id)
        .then((request) => {
            res.send({ status: 'success', request: request })
        })
        .catch((err) => {
            console.log(err);
            res.send({ status: 'error', msg: err })
        })
})

// UPDATE
router.put('/request/:id', (req, res) => {
    FaciliRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, (err, response) => {
        if (err) {
            res.send({ status: 'error', msg: 'DB error' })
            console.log(err)
            return;
        }
        res.send({ status: 'success', request: response })
    })
})

router.post('/register', (req, res) => {
    var volunteer = new Volunteer({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        father_name: req.body.father_name,
        phone: req.body.phone
    });

    volunteer.save((err, volunteer) => {
        if (err) {
            res.send({ status: 'error', msg: err });
        } else {
            res.send({ status: 'success', user: volunteer });
        }
    });
});

/*
Error Codes:
    NOUSER: No user found
    INVPASS: Password Incorrect
    DBERR: Database error
*/
router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    Volunteer.findOne({ email: email })
        .then((volunteer) => {
            if (!volunteer || volunteer.length == 0) {
                res.send({ status: 'error', msg: 'NOUSER' });
            } else {
                if (volunteer.password === password) {
                    volunteer.password = 'encrypted-text';
                    res.send({ status: 'success', user: volunteer });
                } else {
                    res.send({ status: 'error', msg: 'INVPASS' });
                }
            }
        })
        .catch((error) => {
            console.log(error);
            res.send({ status: 'error', msg: 'DBERR' });
        });
});

module.exports = router;