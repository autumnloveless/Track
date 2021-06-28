const authDB = require("../database/controllers/auth");
const usersDB = require("../database/controllers/users");

exports.refreshToken = async (req, res) => {
    console.log("made it here")
    const refreshToken = req.body.token;
    if(refreshToken == null) { return res.sendStatus(401) }
    if(!(await authDB.getAuthByRefreshToken(refreshToken)).success) { return res.sendStatus(403) }
    
    console.log("made it past that point")
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) { return res.sendStatus(403) }
        const result = authDB.regenerateToken({ 
            "id": user.id, 
            "permissionLevel": user.permissionLevel 
        });
        res.status(result.status ? 200 : 400).json(result)
    })
}

exports.login = async (req, res) => {
    const user = { 
        "id": req.user.id,
        "permissionLevel": req.user.permissionLevel
    }
    const result = authDB.generateToken(user)
    res.status(result.status ? 200 : 400).json(result)
}

exports.logout = async (req, res) => {
    result = await authDB.deleteAuth(req.body.token)
    res.status(result.status ? 200 : 400).json(result)
}

exports.register = async (req,res) => {
    result = await usersDB.createUser({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "password": req.body.password,
        "permissionLevel": 1,
    })
    res.status(result.status ? 200 : 400).json(result)
}

exports.registerAdmin = async (req,res) => {
    result = await usersDB.createUser({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "password": req.body.password,
        "permissionLevel": 2,
    })
    res.status(result.status ? 200 : 400).json(result)
}