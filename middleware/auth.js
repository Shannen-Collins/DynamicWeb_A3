//Sets the authorisation local tags for handlebars views 
    //so visitors, admin and super admin see different things
function setAuthLocals(req, res, next){
    res.locals.isAdmin = Boolean(req.session && req.session.adminId);
    res.locals.isSuperAdmin = req.session.adminId && req.session.adminId.role === 'super admin';
    next();
}

//Middleware for admin requirements, checks logged in user's role is admin or super admin
function requireAdmin(req, res, next){
    const admin = req.session.adminId;
    if (!admin){
        return res.redirect('/login');
    }

    if(!['admin', 'super admin'].includes(admin.role)){
        return res.status(403).send('Access denied');
    }
    next();
}

//Middleware for super admin requirements, checks logged in user's role is only super admin
    //so regular admin users can access registration page or functionality 
function requireSuperAdmin(req, res, next){
    const admin = req.session.adminId;
    if(!admin){
        return res.redirect('/login');
    }

    if(admin.role !== 'super admin'){
        return res.status(403).send(`
                <p> Sorry, only super admins can access this page. </p>
                <p> <a href="/">Go Back Home</a> </p>
                `);
    }
    next();
}

module.exports = { setAuthLocals, requireAdmin, requireSuperAdmin };