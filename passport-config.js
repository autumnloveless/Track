const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const userController = require('./controllers/userController');

const initialize = (passport) => {
    const authenticateUser = async (email,password,done) => {
        const user = await userController.getUserByEmail(email);
        if (user == null){ return done(null, false, { message: 'Incorrect Email or Password' }); }
        try {
            if (await bcrypt.compare(password, user.password)){
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect Email or Password' });
            }
        } catch (error) {
            return done(error)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user,done) => done(null, user.id))
    passport.deserializeUser(async (id,done) => done(null, await userController.getUserById(id)))
}

module.exports = {
    initialize
}