// Data Fetch API

const { doc, getDoc, addDoc, collection } = require('firebase/firestore');
const { getDailyCovidData, updateDailyData, bookAppointment, receiveAppointments, cancelAppointment, getRegionData, getHealthCentreInfo, saveDailyData } = require('../models/db');
const { auth, db } = require('../models/firebase');

const router = require('express').Router();


// Fetch Daily Covid Data
router.get('/demographics', async (req, res) => {
    
    try{

        const data = await getDailyCovidData();
        console.log(data)
        if(data != null){
            res.status(200).json(data);
        }
        else {
            throw new Error('Data Fetch Error')
        }
    }

    catch(e){
        res.json(e);
        console.error(e);
    }
});




// Save Daily Covid Data
router.post('/demographics/new', async (req, res) => {

    try{

        // const { dataToUpdate } = req.body;
        console.log(req.body);

        const savedData = await saveDailyData(req.body);

        if(savedData != null){
            res.json({ savedData })
        } else {
            throw new Error('Data Updating Failed');
        }


    } catch(e){
        console.error(e);
        res.json(e);
    }   

});




// Update Daily Covid Data
router.put('/demographics/edit/:date', async (req, res) => {

    try{

        // const { dataToUpdate }= req.body;

        const updatedData = await updateDailyData(req.body);

        if(updatedData != null){
            res.json({ updatedData })
        } else {
            throw new Error('Data Updating Failed');
        }


    } catch(e){
        console.error(e);
        res.json(e);
    }   

});







// Fetch Appointments
router.get('/appointments', (req, res) => {

    try{


        const appointments = receiveAppointments(userId);

        if(appointments != null){
            res.json({
                success: true,
                appointments
            })
        } 

        else {
            throw new Error('Internal Server Error')
        }


    } catch(e){
        console.error(e);
        res.json(e);
    }   

})




// Book Appointments
router.post('/appointments/new', async (req, res) => {

    try{

        const authToken = req.header('auth-token');
        if(authToken == null){
            throw new Error('Unauthorized Operation');
        }

        const userId = req.body.userId;  
        const data = req.body;

        const appointmentBooked = await bookAppointment(data, userId);

        const userData = await getDoc(appointmentBooked);
        console.log(userData.data());

        if(appointmentBooked){
            res.json({success: true, userData})
        } 

        else {
            throw new Error('Internal Server Error')
        }


    } catch(e){
        console.error(e);
        res.json(e);
    }   

})




// Cancel Appointment
router.delete('/appointments/cancel/:id', async (req, res) => {

    try{

        const appointmentId = req.params.id;
        
        const isAppointmentCancelled = await cancelAppointment(appointmentId);

        res.json({success: isAppointmentCancelled });


    } catch(err){
        console.error(err);
        res.json(err);
    }
})




// Get Regions Data
router.get('/regions', (req, res) => {
    
    try{

        const data = getRegionData();

        if(data != null){
            res.json(data);
        } else{
            throw new Error('Data Fetch failed');
        }


    } catch(error){

        console.error(error);
        res.json(error);

    }
})





// Fetch Health Centers 
router.get('/health-centers', (req, res) => {

    try{

        const data = getHealthCentreInfo();
        if(data != null){
            res.json(data);
        } else{
            throw new Error('Data Fetch failed');
        }

    } catch(err){
        console.error(error);
        res.json(error);

    }

})


router.post("/doctor/new", async (req, res) => {
    try{
        const docData = {
            name: req.body.name,
            specialization: req.body.specialization,
            isAvailable: req.body.isAvailable,
            visitingHours: req.body.visitingHours
        }
        const data = await addDoc(collection(db, 'doctors'), docData);

        if(data !== null){
            console.log('doctor added');
            res.json({success: true})
        }

    } catch(err){
        console.error(err);
    }
})


module.exports = router;