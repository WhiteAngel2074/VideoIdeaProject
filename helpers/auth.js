module.exports = {
    ensureAuthentificated : function (req,res,next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Not Autorized'); 
         res.redirect('/users/login');
    }
}