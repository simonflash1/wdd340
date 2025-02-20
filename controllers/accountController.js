const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/* ****************************************
 *  Deliver Loged In view
 * ************************************ 
async function accountLogedIn(req, res) {
let nav = await utilities.getNav()
  res.render("account/logedIn", {
    title: "Logged In",
    nav,
    errors: null
  })
}*/

async function buildAccount(req, res) {
  const nav = await utilities.getNav();
  const account_id = parseInt(res.locals.accountData.account_id);
  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/account-management", {
    title: "Account Management",
    errors: null,
    nav,
    firstname: accountData.account_firstname,
  });
}
/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      //console.log("redirecting to account management")
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

// Account Logout
async function logout(req, res) {
  res.clearCookie("jwt");
  res.redirect("/");
}

// Account Update View
async function buildUpdateAccount(req, res, next) {
  const nav = await utilities.getNav();
  const account_id = req.params.account_id;
  const accountId = parseInt(account_id);
  const accountData = await accountModel.getAccountById(accountId);

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  });
}

// Process the account update

async function updateAccount(req, res) {
  let nav = await utilities.getNav();

  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    delete updateResult.account_password;
    const accessToken = jwt.sign(
      updateResult,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 3600 * 1000,
      }
    );
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      });
    }
    req.flash(
      "notice",
      `Congratulations ${updateResult.account_firstname}, your account was successfully updated.`
    );
    res.status(201).redirect("/account/");
  } else {
    req.flash("notice", "Sorry, failed to update account.");
    res.status(501).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

async function changePassword(req, res) {
  let nav = await utilities.getNav();
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the password change."
    );
    res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }

  const updateResult = await accountModel.changePassword(
    account_id,
    hashedPassword
  );

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, your password change was successful.`
    );
    res.status(201).render("account/account-management", {
      title: "Account",
      nav,
      errors: null,
      firstname: updateResult.account_firstname,
    });
  } else {
    req.flash("notice", "Sorry, failed to Change the password.");
    res.status(501).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

/* ****************************************
 *  Deliver Admin Panel View
 * *************************************** */
async function buildAdminPanel(req, res) {
  let nav = await utilities.getNav();
//  const users = await accountModel.getAllUsers();
  res.render("account/admin", {
    title: "Admin Panel",
    nav,
    errors: null,
  });
}
async function getAllUsers(req, res) {
  try {
    const users = await accountModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error al obtener la lista de usuarios." });
  }
}

/* ****************************************
 *  Deliver Edit User View
 * *************************************** */
async function buildEditUser(req, res) {
  let nav = await utilities.getNav();
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/edit-user", {
    title: "Edit User",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_type: accountData.account_type,
  });
}

/* ****************************************
 *  Process User Update
 * *************************************** */
async function updateUser(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email, account_type } = req.body;

  const updateResult = await accountModel.updateUserById(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_type
  );

  if (updateResult) {
    req.flash("notice", `User ${account_firstname} was successfully updated.`);
    res.status(201).redirect("/account/admin");
  } else {
    req.flash("notice", "Failed to update user.");
    res.status(501).render("account/edit-user", {
      title: "Edit User",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      account_type,
    });
  }
}

/* ****************************************
 *  Deliver Delete User View
 * *************************************** */
async function buildDeleteUser(req, res, next) {
  let nav = await utilities.getNav();
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/delete-confirm", {
    title: "Delete User",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_type: accountData.account_type,
  });
};

/* ****************************************
 *  Process User Deletion
 * *************************************** */
async function deleteUser(req, res) {
  const { account_id } = req.body;
  const deleteResult = await accountModel.deleteUserById(account_id);

  if (deleteResult) {
    req.flash("notice", "User was successfully deleted.");
    res.status(200).redirect("/account/admin");
  } else {
    req.flash("notice", "Failed to delete user.");
    res.status(500).redirect("/account/admin");
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccount,
  logout,
  buildUpdateAccount,
  updateAccount,
  changePassword,
  buildAdminPanel,
  getAllUsers,
  buildEditUser,
  updateUser,
  buildDeleteUser,
  deleteUser
};
