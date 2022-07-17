const { getDoc, doc, updateDoc } = require('firebase/firestore');
const { isAdmin } = require('../middleware/fetchUser');
const { receiveAppointments } = require('../models/db');
const { db } = require('../models/firebase');

const router = require('express').Router();



// Every admin will have healthcenter name
// Show all appointments

router.get('/appointments', isAdmin, async (req, res) => {
    try{
        const healthCenter = req.query.health_center;

        if(healthCenter === null || healthCenter === ''){
            return res.status(400).send("Health Center is to be specified");
        }

        const appointments = await receiveAppointments(healthCenter);

        res.status(200).json(appointments);

    } catch(err){
        console.error(err);
        res.status(500).json(err);
    }
})


// Approve or decline appointments
    // Use a isApproved and isDeclined fields to check appointment details
router.put('/appointments/:id', isAdmin, async (req, res) => {
    
    try{
        const { isApproved, isDeclined } = req.body;    
        const docRef = doc(db, 'appointments', req.params.id)
        let appointment = await getDoc(docRef);
        appointment = appointment.data();

        appointment.isApproved = isApproved;
        appointment.isDeclined = isDeclined;

        const updatedAppointment = await updateDoc(docRef, appointment.data());

        if(updatedAppointment) throw new Error('Operation Failed');
        
        res.status(200).json({ success: true });
    } catch(err){
        console.error(err);
        res.status(500).json(err);
    }

})



module.exports = router;