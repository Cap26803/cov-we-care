const { signOut } = require('firebase/auth');
const { signInUser } = require('../authentication/auth');
const { getDailyCovidData } = require('../models/db');
const { auth } = require('../models/firebase');

const router = require('express').Router();



router.get('/', (req, res) => {
    res.render('index');
});




router.get('/dashboard', async (req, res) => {

    try{
        const dashboardData = await getDailyCovidData();
        res.status(200).render('pages/Dashboard', {
            data: dashboardData,
            err: null
        })

    } catch(error) {
        console.error(error)
        res.status(500).render('pages/ServerError', {
            err: error
        })

    }

    // res.render('pages/Dashboard');

});




router.get('/signIn', (req, res) => {
    res.render('pages/signInPage');
})





router.post('/signIn', async (req, res) => {

    try{    

        const {email, password} = req.body;

        const user = await signInUser(email, password);

        if(user){

            // localStorage.setItem('auth-token', user.uid);
            // res.json(user.uid);
            const token = await user.getIdToken();
            const userId = user.uid;
            res.json({
                token,
                userId
            });
            // res.status(200).redirect('/users');
            
        
        } else{
            throw new Error('Internal Server Error');
        }


    } catch(err){
        res.render('pages/signInPage', {
            error: err
        });
        console.error(err);
    }
});


router.post('/logout', async (req, res) => {
    try{

        await signOut(auth);
        res.redirect('/signIn');

        

    } catch(e) {
        console.error('Error Signing Out');
        res.json(e);
    }
})


module.exports = router;