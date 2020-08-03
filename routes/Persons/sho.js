const express = require('express'),
    router = express.Router(),
    Sho = require('../../models/Sho');

// Endpoint : '/sho/'


router.post('/register', (req, res) => {
    var sho = new Sho({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        father_name: req.body.father_name,
        phone: req.body.phone
    });

    sho.save((err, sho) => {
        if (err) {
            res.send({ status: 'error', msg: err });
        } else {
            res.send({ status: 'success', user: sho });
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

    Sho.findOne({ email: email })
        .then((sho) => {
            if (!sho || sho.length == 0) {
                res.send({ status: 'error', msg: 'NOUSER' });
            } else {
                if (sho.password === password) {
                    sho.password = 'encrypted-text';
                    res.send({ status: 'success', user: sho });
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