import Sp, { findOne } from '../../models/Sp';

export const registerSp = async (req, res) => {
    try {
        const { body = {} } = req
        const { first_name, last_name, email, password, father_name, phone } = body
        const sp = new Sp({
            first_name,
            last_name,
            email,
            password,
            father_name,
            phone
        });
        await sp.save()
        res.send({ status: 'success', user: sp });
    } catch (error) {
        res.send({ status: 'error', msg: err });
    }
}

export const loginSp = async (req, res) => {
    try {
        const { body = {} } = req
        const { email, password, image_id } = body
        const sp = findOne({ email })    
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
    } catch (error) {
        res.send({ status: 'error', msg: 'DBERR' });
    }
}