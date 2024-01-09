const express = require('express');
const router = express.Router({ mergeParams: true });
const { updateUser, updatePassword, updateUserName, updateEmail, updatePhone, deactivateAccount, deleteAccount, recoverPassword } = require('../handlers/users');

router.route("/profiles/update").put(updateUser);
router.route("/info/update/password").put(updatePassword);
router.route("/info/update/email").put(updateEmail);
router.route("/info/update/phone").put(updatePhone);
router.route("/info/update/username").put(updateUserName);
router.route("/account/deactivate").put(deactivateAccount);
router.route("/account/delete").put(deleteAccount);



module.exports = router;
