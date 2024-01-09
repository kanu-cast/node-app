const express = require('express');
const router = express.Router({ mergeParams: true });
const { recoverPassword, signUp , signIn, signOut} = require('../handlers/auth');

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/signout").post(signOut);

// router.route("/account/recover").post(recoverPassword);

module.exports = router;
