const express = require('express'),
    router = express.Router(),
    Io = require('../../models/Io');

// Endpoint : '/io/'


router.post('/register', (req, res) => {
    var io = new Io({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        father_name: req.body.father_name,
        phone: req.body.phone
    });

    io.save((err, io) => {
        if (err) {
            res.send({ status: 'error', msg: err });
        } else {
            res.send({ status: 'success', user: io });
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

    Io.findOne({ email: email })
        .then((io) => {
            if (!io || io.length == 0) {
                res.send({ status: 'error', msg: 'NOUSER' });
            } else {
                if (io.password === password) {
                    io.password = 'encrypted-text';
                    res.send({ status: 'success', user: io });
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