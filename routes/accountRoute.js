// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount)
);

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Process the logout
router.get("/logout", utilities.handleErrors(accountController.logout));

// Account update view
router.get(
  "/update-account/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
);

// Process the account update view
router.post(
  "/update-account/:account_id",
  utilities.checkLogin,
  regValidate.accountRules(),
  regValidate.checkAccountData,
  utilities.handleErrors(accountController.updateAccount)
);
// Process the account update
router.post(
  "/update/",
  utilities.checkLogin,
  regValidate.accountRules(),
  regValidate.checkAccountData,
  utilities.handleErrors(accountController.updateAccount)
);

// Password reset
router.post(
  "/change-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
);

/* ****************************************
 *  Admin Routes
 * **************************************** */

// Admin panel view (only accessible to admins)
router.get(
  "/admin",
  utilities.checkLogin,
    utilities.checkAccountType,
  utilities.handleErrors(accountController.buildAdminPanel)
);

router.get('/admin/getUsers', async (req, res) => {
  await accountController.getAllUsers(req, res)
})


// Edit user view
router.get(
  "/admin/edit/:account_id",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(accountController.buildEditUser)
);

// Process user update
router.post(
  "/edit-user/:account_id",
  utilities.checkLogin,
  utilities.checkAccountType,
  regValidate.accountRules(),
  regValidate.checkAccountData,
  utilities.handleErrors(accountController.updateUser)
);

// user deletion view
router.get(
  "/admin/delete-confirm/:account_id",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(accountController.buildDeleteUser)
);
// Process user deletion
router.post(
  "/delete-user",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(accountController.deleteUser)
);

module.exports = router;
