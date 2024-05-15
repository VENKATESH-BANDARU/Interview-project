const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const Helpers = require('../Helpers/helper')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/v1/users/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            let token = await Helpers.jwtToken({ id: user._id }, process.env.USER_SECRET_KEY);
            user.token = token;
            await user.save();
            done(null, user);
        } else {
            const newUser = new User({
                fullName: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value,
                provider: 'google',
            });
            await newUser.save();
            let token = await Helpers.jwtToken({ id: newUser._id }, process.env.USER_SECRET_KEY);
            newUser.token = token;
            await newUser.save();
            done(null, newUser);
        }
    } catch (err) {
        console.error(err);
        done(err, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).exec()
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, false);
        });
});

module.exports = passport