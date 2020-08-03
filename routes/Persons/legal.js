const express = require('express'),
    router = express.Router(),
    Legal = require('../../models/Legal');

// Endpoint : '/legal/'


router.post('/register', (req, res) => {
    var legal = new Legal({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        father_name: req.body.father_name,
        phone: req.body.phone
    });

    legal.save((err, legal) => {
        if (err) {
            res.send({ status: 'error', msg: err });
        } else {
            res.send({ status: 'success', user: legal });
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

    Legal.findOne({ email: email })
        .then((legal) => {
            if (!legal || legal.length == 0) {
                res.send({ status: 'error', msg: 'NOUSER' });
            } else {
                if (legal.password === password) {
                    legal.password = 'encrypted-text';
                    res.send({ status: 'success', user: legal });
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