const express = require('express'),
    router = express.Router();

const exec = require('child_process').exec;

// Endpoint: /analyse/

router.get('/faces/:imageId', (req, res) => {
    console.log('Analyse faces');
    let imageId = req.params.imageId;
    let path = `document\\uploads\\${imageId}`;

    exec(`python saveFaces.py ${path} ${imageId}`, (err, stdout, stderr) => {
        if (err) {
            console.log(err)
            res.send({ status: 'error', msg: err });
        } else {
            let out = stdout.split('\n');
            let suspectPath = out[0];
            console.log('Total', out[1]);
            console.log('stdout', stdout);
            res.send({ status: 'success', path: suspectPath, total: out[1] });
        }
    })
})

module.exports = router;