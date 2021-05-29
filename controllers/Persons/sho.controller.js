import Sho, { findOne } from '../../models/Sho';

export const registerSho = async (req, res) => {
    try {
        const { body = {} } = req
        const { first_name, last_name, email, password, father_name, phone } = body
        const sho = new Sho({
            first_name,
            last_name,
            email,
            password,
            father_name,
            phone
        });
        await sho.save()
        res.send({ status: 'success', user: sho });
    } catch (error) {
        res.send({ status: 'error', msg: err });
    }
}

export const loginSho = async (req, res) => {
    try {
        const { body = {} } = req
        const { email, password, image_id } = body
        const sho = findOne({ email })    
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
    } catch (error) {
        res.send({ status: 'error', msg: 'DBERR' });
    }
}