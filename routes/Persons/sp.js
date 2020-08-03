const express = require('express'),
    router = express.Router(),
    Sp = require('../../models/Sp');

// Endpoint : '/sp/'


router.post('/register', (req, res) => {
    var sp = new Sp({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        father_name: req.body.father_name,
        phone: req.body.phone
    });

    sp.save((err, sp) => {
        if (err) {
            res.send({ status: 'error', msg: err });
        } else {
            res.send({ status: 'success', user: sp });
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
    let image_id = req.body.image_id;

    Sp.findOne({ email: email })
        .then((sp) => {
            if (!sp || sp.length == 0) {
                res.send({ status: 'error', msg: 'NOUSER' });
            } else {
                if (sp.password === password) {
                    sp.password = 'encrypted-text';
                    res.send({ status: 'success', user: sp });
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