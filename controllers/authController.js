const authDB = require("../database/controllers/auth");
const usersDB = require("../database/controllers/users");
const moment = require("moment");
jwt = require("jsonwebtoken")

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if(refreshToken == null) { return res.sendStatus(401) }
    authResult = await authDB.getAuthByRefreshToken(refreshToken);
    if(!authResult.success) { return res.sendStatus(403) }
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if(err) { return res.sendStatus(403) }
        const result = await authDB.regenerateToken(authResult.auth.id, { 
            "id": user.id, 
            "permissionLevel": user.permissionLevel 
        });
        
        res.status(result.success ? 200 : 400).json(result)
    })
}

exports.login = async (req, res) => {
    const user = { 
        "id": req.user.id,
        "permissionLevel": req.user.permissionLevel
    }
    const result = await authDB.generateToken(user)
    res.cookie('refresh_token', result.refreshToken, { secure: true, httpOnly: true, path: "/api/token", expires: moment().add(7,'days').toDate() });
    res.status(result.success ? 200 : 400).json({ success: result.success, accessToken: result.accessToken })
}

exports.logout = async (req, res) => {
    result = await authDB.deleteAuth(req.body.token)
    res.status(result.success ? 200 : 400).json(result)
}

exports.register = async (req,res) => {
    result = await usersDB.createUser({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "password": req.body.password,
        "permissionLevel": 1,
    })
    res.status(result.success ? 200 : 400).json(result)
}

exports.registerAdmin = async (req,res) => {
    result = await usersDB.createUser({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "password": req.body.password,
        "permissionLevel": 2,
    })
    res.status(result.success ? 200 : 400).json(result)
}