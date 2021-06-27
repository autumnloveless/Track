const models = require('../database/models');
const usersDB = require('./database/controllers/users');
const jwt = require("jsonwebtoken");

exports.refreshToken = async (req, res) => {
    const refreshToken = req.body.token;
    if(refreshToken == null) { return res.sendStatus(401) }
    if(!(await getAuthByRefreshToken(refreshToken)).success) { return res.sendStatus(403) }
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) { return res.sendStatus(403) }
        const accessToken = generateToken({ "email": user.email, "permissionLevel": user.permissionLevel });
        await updateAuth({ accessToken: accessToken });
        return res.status(200).json({ accessToken: accessToken })
    })
}

exports.login = async (req, res) => {
    const user = { 
        "id": req.user.id,
        "permissionLevel": req.user.permissionLevel
    }
    const tokens = generateToken(user)
    return res.status(200).json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })
}

exports.logout = async (req, res) => {
    const refreshToken = req.body.token;
    result = await deleteAuth(refreshToken)
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
    user = await userController.createUser({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "password": req.body.password,
        "permissionLevel": 2,
    })
    res.status(200).json({ "success": true, "user": user })
}

const generateToken = async (user) => {
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m'})
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    await createAuth({ userId: user.id, accessToken: accessToken, refreshToken: refreshToken })

    return { accessToken: accessToken, refreshToken: refreshToken }
}

const createAuth = (auth) => {
    const newAuth = await models.Auth.create({
        userId: auth.userId, 
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
    });
}

const getAuthById = async (id) => {
    const auth = await models.Auth.findOne({ where: { id: id } });
    if (auth) { 
        return { "success": true, "auth": auth } 
    } else { 
        return { "success": false, "error": "Auth Record Not Found" } 
    }
 }

const deleteAuth = async (refreshToken) => {
    auth = await getAuthByRefreshToken(refreshToken);
    if(!auth.success) { auth }
    await auth.destroy({ force: true })
    return { "success": true };
}

const updateAuth = async (newData) => {
    auth = await getAuthById(newData.id);
    if(!auth.success) { auth }
    updatedAuth = await auth.update(newData)
    return { "success": true };
}

const getAuthByRefreshToken = (refreshToken) => {
    const auth = await models.Auth.findOne({ where: { refreshToken: refreshToken } });
    if (auth) { 
        return { "success": true, "auth": auth } 
    } else { 
        return { "success": false, "error": "Auth Record Not Found" } 
    }
 }