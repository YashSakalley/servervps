import FaciliRequest from '../../models/FaciliRequest';
import Volunteer from '../../models/Volunteer';

export const registerVolunteer = async (req, res) => {
    try {
        const { body = {} } = req
        const { first_name, last_name, email, password, father_name, phone } = body
        const volunteer = new Volunteer({
            first_name,
            last_name,
            email,
            password,
            father_name,
            phone
        });
        await volunteer.save();
        res.send({ status: 'success', user: volunteer });
    } catch (error) {
        res.send({ status: 'error', msg: error });
    }
}

export const loginVolunteer = async (req, res) => {
    try {
        const { body = {} } = req;
        const { email, password } = body
        const volunteer = await Volunteer.findOne({ email })
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
    } catch (error) {
        res.send({ status: 'error', msg: 'DBERR' });
    }
}

export const createFacilitatorRequest = async (req, res) => {
    try {   
        const { lat, lng, phone } = req.body;
        const request = new FaciliRequest({
            lat,
            lng,
            phone,
            status: 'Pending'
        })
        await request.save()
        res.send({ status: 'success', request })
    } catch (error) {
        res.send({ status: 'error' })
    }
}

export const getFacilitatorRequests = async (req, res) => {
    try {
        const requests = await FaciliRequest.find({});
        res.send({ status: 'success', requests: requests })
    } catch (error) {    
       res.send({ status: 'error', msg: error })
    }
}

export const getFacilitatorRequestById = async (req, res) => {
    try {
        const request = await FaciliRequest.findById(req.params.id)
        res.send({ status: 'success', request: request })
    } catch (error) {
        res.send({ status: 'error', msg: error })
    }
}

export const updateFacilitatorRequestById = async (req, res) => {
    try {
        const { body = {}, params } = req;
        const { status } = body
        const { id } = params
        const response = await FaciliRequest.findByIdAndUpdate(id, { status })
        res.send({ status: 'success', request: response })
    } catch (error) {
        res.send({ status: 'error', msg: 'DB error' })
    }
}
