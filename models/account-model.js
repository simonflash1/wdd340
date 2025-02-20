const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

/* *****************************
 * Return account data using id
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching account found");
  }
}

/* *****************************
 * Update account data
 * ***************************** */
async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email
) {
  try {
    const sql =
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.log("model error: " + error);
  }
}

/* *****************************
 * change password data
 * ***************************** */
async function changePassword(account_id, account_password) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const data = await pool.query(sql, [account_password, account_id]);
    return data.rows[0];
  } catch (error) {
    console.log("model error: " + error);
  }
}

/* *****************************
 * GET ALL USERS
 * *************************** */
async function getAllUsers() {
  try {
    const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account ORDER BY account_id";
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error("Error en getAllUsers:", error);
    throw new Error("Error al obtener la lista de usuarios.");
  }
}

/* *****************************
 * UPDATE BY ID
 * *************************** */
async function updateUserById(account_id, account_firstname, account_lastname, account_email, account_type) {
  try {
    const sql = `UPDATE account 
                 SET account_firstname = $1, 
                     account_lastname = $2, 
                     account_email = $3, 
                     account_type = $4 
                 WHERE account_id = $5 
                 RETURNING *`;
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_type,
      account_id
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error en updateUserById:", error);
    throw new Error("Error al actualizar el usuario.");
  }
}

/* *****************************
 * DELETE BY ID
 * *************************** */
async function deleteUserById(account_id) {
  try {
    const sql = "DELETE FROM account WHERE account_id = $1 RETURNING *";
    const result = await pool.query(sql, [account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error en deleteUserById:", error);
    throw new Error("Error al eliminar el usuario.");
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  changePassword,
  getAllUsers,
  updateUserById,
  deleteUserById
};
