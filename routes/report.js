var express = require('express'),
    router = express.Router(),
    Report = require('../models/Report'),
    twilio = require('twilio'),
    config = require('../config/otp_config'),
    client = twilio(config.accountSID, config.authToken),
    User = require('../models/User');

const exec = require('child_process').exec;

// Endpoint : '/reports/'


// CREATE
router.post('/', (req, res) => {
    const { crime, answers, questions, user_id, media_files, signature, image_id } = req.body;
    var reportBody = new Report({
        crime,
        answers,
        questions,
        user_id,
        media_files,
        signature,
        image_id,
        status: 'Pending',
        is_facilitator_filled: req.body.is_facilitator_filled ? true : false
    });
    console.log(reportBody);

    reportBody.save()
        .then((report) => {
            if (reportBody.user_id === 'Not Available') {
                res.send({ status: 'success', report: reportBody });
                return
            }
            User.findById(reportBody.user_id)
                .then((user) => {
                    user.reports.push(report._id);
                    user.save();
                    res.send({ status: 'success', report: reportBody });
                })
                .catch((err) => {
                    res.send({ status: 'error', msg: err })
                })
        })
        .catch((err) => {
            console.log(err);
            res.send({ status: 'error', msg: 'Error saving REPORT' });
        });

    exec(`mongodump -d vps -h localhost`, (err, stdout, stderr) => {
        if (err) {
            console.log('Error backup DB');
            console.log(err)
        } else {
            console.log(stdout, stderr);
            console.log('Backup Created');
        }
    })
});

// READ
router.get('/', (req, res) => {
    Report.find({})
        .then((reports) => {
            res.send({ status: 'success', reports: reports });
        })
        .catch((error) => {
            res.send({ status: 'error', msg: error });
        });
});

router.get('/info/count', (req, res) => {
    let approved = 0, pending = 0, rejected = 0;
    let cb = 0, hp = 0, theft = 0, mur = 0, viol = 0, oth = 0;
    Report.find({})
        .then((reports) => {
            reports.forEach(report => {

                let status = report.status;
                if (status.includes('Approved')) {
                    approved += 1
                } else if (status.includes('Rejected')) {
                    rejected += 1
                } else {
                    pending += 1
                }

                let crime = report.crime;
                if (crime === 'CYBER BULLYING') {
                    cb += 1
                } else if (crime === 'HACKING OR PHISHING') {
                    hp += 1
                } else if (crime === 'THEFT') {
                    theft += 1
                } else if (crime === 'MURDER') {
                    mur += 1
                } else if (crime === 'VIOLENCE') {
                    viol += 1
                } else if (crime === 'OTHER') {
                    oth += 1
                }

            })
            res.send({
                status: 'success', count: {
                    cb, hp, theft, mur, viol, oth, approved, rejected, pending
                }
            })
        })
        .catch((error) => {
            console.log(error);
            res.send({ status: 'error' })
        })
})

router.get('/:id', (req, res) => {
    Report.findById(req.params.id)
        .then((report) => {
            User.findById(report.user_id)
                .then((user) => {
                    res.send({ status: 'success', report: report, user: user });
                })
                .catch((error) => {
                    res.send({ status: 'error', msg: error });
                })
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
            reports = user.reports;
            var promises = reports.map(async (report) => {
                const results = await report.findById(report)
                    .then((report) => {
                        return report;
                    })
                    .catch((error) => {
                        console.log(error);
                        res.send({ status: 'error', msg: error });
                    });
                return results;
            });
            Promise.all(promises).then(function (results) {
                console.log('results', results);
                res.send({ status: 'success', reports: results });
            });
        })
        .catch((error) => {
            console.log(error);
            res.send({ status: 'error', msg: error });
        });
});

router.get('/status/:status', (req, res) => {
    Report.find({ status: req.params.status })
        .then((reports) => {
            res.send({ status: 'success', reports: reports });
        })
        .catch((error) => {
            res.send({ status: 'error', msg: error });
        });
});

// UPDATE
router.put('/work/:id', (req, res) => {
    console.log(req.body.work);
    Report.findById(req.params.id, (err, report) => {
        if (err) {
            res.send({ status: 'error', msg: 'DB error' })
            console.log(err)
            return;
        }
        report.work.push(req.body.work)
        report.save()
            .then((res) => {
                console.log('Saved work');
                res.send({ status: 'success', report: report });
            })
            .catch((err) => {
                console.log(err);
                res.send({ status: 'error', msg: 'Saving error' })
            })
    });
})

router.put('/complete/:id', (req, res) => {
    Report.findByIdAndUpdate(req.params.id, req.body, (err, report) => {
        if (err) {
            res.send({ status: 'error', msg: 'DB error' })
            console.log(err)
            return;
        }
        res.send({ status: 'success', report: report });
    });
})

router.put('/:id', (req, res) => {
    Report.findByIdAndUpdate(req.params.id, { status: req.body.status, reason: req.body.reason }, (err, report) => {
        if (err) {
            res.send({ status: 'error', msg: 'DB error' })
            console.log(err)
            return;
        }
        res.send({ status: 'success', report: report });
        console.log(req.body.reason);
        if (req.body.reason) {
            // Send text message for rejected
            client.messages
                .create({
                    body: `Your report has been rejected. Report id: ${report._id}, Reason: ${req.body.reason}. Please update the report details in order to proceed`,
                    from: '+13015337570',
                    to: '+917974961262'
                })
                .then(message => {
                    console.log(message)
                    console.log(message.sid)
                })
                .done((err) => {
                    if (err)
                        console.log(err);
                    else
                        console.log('SMS SENT FOR REJECTED');
                });
        }
    });
});

// DELETE
router.delete('/:id', (req, res) => {
    res.send('Deleted for id', req.params.id);
});

module.exports = router;