const router = require('express').Router();
const Users = require('../controllers/user.controller');
const upload = require('../config/fileUpload');
const { userVerifyToken } = require('../middleware/authMiddleware');
const UserValidation = require('../validators/user.validation');
const passport = require("passport");

/* GET users listing. */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/api/v1/users/login' }), (req, res) => {
    res.redirect('/api/v1/users');
});

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Demo-Project' });
});

router.route('/registration').post(upload.files(['avatar']), UserValidation.UserAddValidation(), Users.userRegistration);
router.route('/edit').post(upload.files(['avatar']), userVerifyToken, Users.editUserData);
router.route('/image').post(upload.files(["avatar"]), Users.uploadImage);
router.route('/login').post(UserValidation.UserLoginValidation(), Users.userLogin);
router.route('/logout').post(userVerifyToken, Users.userLogout);
router.route('/profile').get(userVerifyToken, Users.myProfile);
router.route('/status').post(userVerifyToken, Users.changeProfileStatus);
router.route('/private').get(userVerifyToken, Users.getAllPrivateUsers);
router.route('/public').get(userVerifyToken, Users.getAllPublicUsers);

module.exports = router;