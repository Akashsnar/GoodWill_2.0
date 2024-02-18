module.exports .requireLogin=(req,res,next)=>{
    if(req.session &&req.session.user )
    {
        return next();
    }
    else return res.redirect('/log');
}
module.exports .requireLogin_ngo=(req,res,next)=>{
    if(req.session &&req.session.ngo )
    {
        return next();
    }
    else return res.redirect('/log');
}

