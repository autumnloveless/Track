const authDB = require("./database/controllers/auth");
const usersDB = require("./database/controllers/users");

exports.refreshToken = async (req, res) => {
    const refreshToken = req.body.token;
    if(refreshToken == null) { return res.sendStatus(401) }
    if(!(await authDB.getAuthByRefreshToken(refreshToken)).success) { return res.sendStatus(403) }
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) { return res.sendStatus(403) }
        const accessToken = authDB.regenerateToken({ 
            "id": user.id, 
            "permissionLevel": user.permissionLevel 
        });
        return res.status(200).json({ accessToken: accessToken });
    })
}

exports.login = async (req, res) => {
    const user = { 
        "id": req.user.id,
        "permissionLevel": req.user.permissionLevel
    }
    const tokens = authDB.generateToken(user)
    return res.status(200).json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })
}

exports.logout = async (req, res) => {
    const refreshToken = req.body.token;
    result = await authDB.deleteAuth(refreshToken)
    if(result.success) { 
        return res.sendStatus(200).json(result) 
    } else { 
        return res.sendStatus(400).json(result) 
    }
}

exports.register = async (req,res) => {
    user = await usersDB.createUser({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "password": req.body.password,
        "permissionLevel": 1,
    })
    res.status(200).json({ "success": true, "user": user })
}

exports.registerAdmin = async (req,res) => {
    user = await usersDB.createUser({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "password": req.body.password,
        "permissionLevel": 2,
    })
    res.status(200).json({ "success": true, "user": user })
}