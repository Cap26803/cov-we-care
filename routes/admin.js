const { isAdmin } = require('../middleware/fetchUser');

const router = require('express').Router();



// Every admin will have healthcenter name
router.get('/appointments', isAdmin, (req, res) => {
    try{
        


    } catch(err){
        console.error(err);
        res.status(500).json(err);
    }
})

// Show all appointments




// Approve or decline appointments
    // Use a isApproved and isDeclined fields to check appointment details




module.exports = router;