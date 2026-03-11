import db from "../config/db.js";

export const findUserByMail = async (mail) => {
  try {
    const [rows] = await db.query("SELECT * FROM user WHERE mail = ?", [mail]);
    return rows[0];
  } catch (error) {
    console.error("erreur FindUserByMail", error.message);
    throw error;
  }
};

export const createUser = async ({ mail, password }) => {
  try {
    await db.query("INSERT INTO user (mail , password) VALUES (?,?)", [
      mail,
      password,
    ]);
  } catch (error) {
    console.error("erreur createUser", error.message);
  }
};

export const deleteUserByMail = async (mail) => {
  try {
    const [result] = await db.query("DELETE FROM user WHERE mail = ?", [mail]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("erreur deleteUserByMail", error.message);
  }
};

export const updateUser = async (mail, data) => {
  try {
    await db.query(
      "UPDATE user SET password = ?WHERE mail = ?",
      [data.password,mail],
    );
  } catch (error) {
    console.error("erreur updateUser", error.message);
  }
};
