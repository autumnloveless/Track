const authDB = require("../database/controllers/auth");
const usersDB = require("../database/controllers/users");
jwt = require("jsonwebtoken")

exports.refreshToken = async (req, res) => {
    const refreshToken = req.body.token;
    if(refreshToken == null) { return res.sendStatus(401) }
    authRecord = await authDB.getAuthByRefreshToken(refreshToken);
    if(!authRecord.success) { return res.sendStatus(403) }
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if(err) { return res.sendStatus(403) }
        const result = await authDB.regenerateToken(authRecord.id, { 
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
    res.status(result.success ? 200 : 400).json(result)
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