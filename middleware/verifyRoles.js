const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
       if(!req?.roles) {
            res.sendStatus(401); // unauthorized
           return;
       }
         const roles = [...allowedRoles];
         const result = req.roles.map(role => roles.includes(role)).find(val => val === true);
            if(!result) {
                res.sendStatus(403); // forbidden
                return;
            }
            next();
    }
}

module.exports = { verifyRoles };