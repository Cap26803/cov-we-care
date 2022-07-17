const { getDoc, doc, updateDoc } = require('firebase/firestore');
const { isAdmin } = require('../middleware/fetchUser');
const { receiveAppointments } = require('../models/db');
const { db } = require('../models/firebase');

const router = require('express').Router();



// Every admin will have healthcenter name
// Show all appointments
router.get('/', (req, res) => {
    res.render('pages/User');
})



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


router.get('/appointments/:id', isAdmin,  async (req, res) => {

    try{
        const appointmentId = req.params.id;

        const appointmentRef = doc(db, 'appointments', appointmentId);
        const appointmentSnap = await getDoc(appointmentRef);

        if(!appointmentSnap.exists()) res.status(400).json({message: "Appointment Not Found"});

        res.status(200).json({
            message: "Operation successful",
            success: true,
            data: appointmentSnap.data()
        });

    } catch(err){

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