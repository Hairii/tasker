import argon2 from "argon2";
import jwt from "jsonwebtoken";

import {
  findUserByMail,
  createUser,
  deleteUserByMail,
  updateUser,
} from "../models/auth.model.js";
import { registerSchema } from "../validations/auth.validation.js";

// register user
export const register = async (req, res) => {
  try {
    const { mail, password } = req.body;

    const { error } = registerSchema.validate({ mail, password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const existingUser = await findUserByMail(mail);
    if (existingUser) {
      return res.status(409).json({ message: "email deja utilisé" });
    }
    const hash = await argon2.hash(password);
    await createUser({ mail, password: hash });
    res.status(201).json({ message: "utilisateur créé" });
  } catch (error) {
    console.error("erreur register", error.message);
    res.status(500).json({ message: "erreur serveur (register)" });
  }
};

export const login = async (req, res) => {
  try {
    const { mail, password } = req.body;
    const user = await findUserByMail(mail);
    if (!user) {
      return res.status(401).json({ message: "identifiants invalide" });
    }
    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "identifiants invalide" });
    }

    const token = jwt.sign(
      { id: user.id, mail: user.mail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    //stockage dans cookies
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, // 1h
    });

    res.json({ message: "Connexion réussie" });
  } catch (error) {
    console.error("erreur login", error.message);
    res.status(500).json({ message: "erreur serveur (login)" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const mail = req.user.mail;
    const deleted = await deleteUserByMail(mail);
    if (!deleted) {
      return res.status(404).json({ message: "utilisateur introuvable" });
    }
    res.json({ message: "utilisateur supprimé" });
  } catch (error) {
    console.error("erreur deleteUser", error.message);
    res.status(500).json({ message: "erreur serveur (deleteUser)" });
  }
};

export const update = async (req, res) => {
  try {
    const mail = req.user.mail;

    const existingUser = await findUserByMail(mail);
    if (!existingUser) {
      return res.status(404).json({ message: "utilisateur introuvable" });
    }
    const newPassword = req.body.password ?? existingUser.password;
    const hash = await argon2.hash(newPassword);
    await updateUser(mail, { password: hash });
    res.json({ message: "mot de passe mis à jour" });
  } catch (error) {
    console.error("erreur updateUser", error.message);
    res.status(500).json({ message: "erreur serveur (updateUser)" });
  }
};
