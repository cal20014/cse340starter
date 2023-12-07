/* ***********************
 * Account Controller
 *************************/
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ***********************
 * Deliver Login View
 *************************/
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ***********************
 * Deliver Registration View
 *************************/
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ***********************
 * Process Registration
 *************************/
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing in database
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error registering your account.");
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
      `Congratulations, you\'re registered ${account_firstname}! Please log in.`
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
      errors: null,
    });
  }
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
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Denied");
  }
}

/* ***********************
 * Process Logout
 *************************/
async function logout(req, res) {
  req.session.destroy();
  res.redirect("/");
}

/* ***********************
 * Get Account View
 *************************/
async function getAccountManagementView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ***********************
 * Deliver Update Account View
 *************************/
async function getUpdateAccountView(req, res, next) {
  let nav = await utilities.getNav();
  const accountData = await accountModel.getAccountById(req.params.account_id);
  console.log(accountData);
  res.render("account/updateAccount", {
    title: "Update Account",
    nav,
    accountData,
    account_firstname: accountData.account_firstname,
    errors: null,
  });
}

/* ***********************
 * Process Update Account
 *************************/

// use redirect instead of render
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, account_name } = req.body;
    res.render("account/", {
      title: "Update Account",
      nav,
      errors: null,
      account_email,
      account_name,
    });
    return;

  const updateResult = await accountModel.updateAccount(
    account_email,
    account_name
  );

  let message;
  if (updateResult) {
    message = "Account updated successfully.";
  } else {
    message = "Failed to update account.";
  }

  req.flash("notice", message);

  const accountData = await accountModel.getAccountByEmail(account_email);

  if (updateResult) {
    res.status(200);
  } else {
    res.status(500);
  }

  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData,
    errors: null,
  });
}

/* ***********************
 * Process Change Password
 *************************/
async function changePassword(req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, oldPassword, newPassword } = req.body;
  const errors = validate.checkPasswordData(req);

  if (errors.length > 0) {
    res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account_email,
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updateResult = await accountModel.updatePassword(
    account_email,
    hashedPassword
  );

  let message;
  if (updateResult) {
    message = "Password updated successfully.";
  } else {
    message = "Failed to update password.";
  }

  req.flash("notice", message);

  const accountData = await accountModel.getAccountByEmail(account_email);

  if (updateResult) {
    res.status(200);
  } else {
    res.status(500);
  }

  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData,
    errors: null,
  });
}

/* ***********************
 * Process Logout
 *************************/
function logout(req, res) {
  res.clearCookie("jwt");
  res.redirect("/");
}

/* ***********************
 * Export Controller
 *************************/

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  logout,
  getAccountManagementView,
  getUpdateAccountView,
  updateAccount,
  changePassword,
  logout,
};
