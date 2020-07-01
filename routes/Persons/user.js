var express = require('express'),
    router = express.Router(),
    Aadhaar = require('../../models/Aadhaar'),
    User = require('../../models/User');

// Endpoint : '/user/'


// CREATE
router.post('/create', (req, res) => {
    let uid = req.body.uid;
    User.findOne({ uid: uid }, (err, user) => {
        if (err) {
            res.json({ status: 'error', msg: 'Database Error' });
        } else if (!user || user.length == 0) {
            Aadhaar.findOne({ uid: uid }, (err, aadhaarUser) => {
                if (err) {
                    res.json({ status: 'error', msg: 'Database Error' })
                } else if (!aadhaarUser || aadhaarUser.length == 0) {
                    res.json({ status: 'error', msg: 'No user found in Aadhaar database' });
                } else {
                    console.log('UserFound', aadhaarUser);
                    var newUser = new User({
                        first_name: aadhaarUser.first_name,
                        last_name: aadhaarUser.last_name,
                        uid: aadhaarUser.uid,
                        address: aadhaarUser.address,
                        father_name: aadhaarUser.father_name,
                        phone: aadhaarUser.phone,
                        email: aadhaarUser.email
                    });
                    newUser.save();
                    res.json({ status: 'success', user: user });
                }
            });
        } else {
            console.log('User exists', user);
            res.json({ status: 'success', user: user });
        }
    });
});

// READ
// User's id in database is used as token
router.post('/token', (req, res) => {
    let token = req.body.token;
    User.findById(token, (err, user) => {
        if (err) {
            res.send({ status: 'error', msg: 'Error occurred' });
        } else if (!user || user.length == 0) {
            res.send({ status: 'error', msg: 'No user found' });
        } else {
            res.send({ status: 'success', user: user });
        }
    });
});

module.exports = router;