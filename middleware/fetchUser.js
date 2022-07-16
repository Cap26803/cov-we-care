export function isAuthenticated(req, res, next){

    try{
        const userId = req.header('user');

    } catch(err){

    }

}

export function isAdmin(req, res, next){
    try{
        const adminId = req.header('admin');

        if(!adminId || adminId === ''){
            throw new Error('Unauthorized Access');
        }

        req.admin = adminId;
        next();

    } catch(err){
        console.error(err);
        res.status(500).json(err);
    }
}