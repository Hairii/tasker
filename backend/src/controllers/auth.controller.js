import argon2 from "argon2";
import jwt from "jsonwebtoken";
import path from "path";

import { findUserByMail, createUser , deleteUserByMail , updateUser} from "../models/auth.model.js";
import { registerSchema } from "../validations/auth.validation.js";

//register user
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


export const login = async (req,res) => {
    try {
        const {mail , password} = req.body;
        const user = await findUserByMail(mail);
        if(!user) {
            return res.status(401).json({message: "identifiants invalide :'("});
        }
        const isValidPassword = await argon2.verify(
            user.password,
            password
        );
        if (!isValidPassword){
            return res.status(401).json({
                message : "identifiants invalide :'("
            })
        }
        //token jwt
        const token = jwt.sign({
            id: user.id,
            mail : user.mail
        },
            process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );

        //stockage token dans cookies
        res.cookie('token', token , {
            httpOnly:true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 //1d
        });
        res.json({
            message : "Connexion réussie", token: token, id: user.id
        })
    } catch (error) {
        console.error('erreur login', error.message);
        res.status(500).json({
            message: "erreur serveur (login)"
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { mail } = req.body;
        const deleted = await deleteUserByMail(mail);
        if (!deleted) {
            return res.status(404).json({ message : 'utilisateur introuvable'})
        }
        res.json({ message : 'utilisateur supprimé'})
    } catch (error) {
        console.error('erreur deleteUser', error.message);
        res.status(500).json({ message : 'erreur serveur (deleteUser)'})
    }
}

export const update = async (req, res) => {
    try {
        const { mail } = req.body

        const existingUser = await findUserByMail(mail);
        if (!existingUser) {
            return res.status(404).json({message : "utilisateur introuvable"})
        }
        const updatedData = {
            password: req.body.password ?? existingUser.password
        }
        const hash = await argon2.hash(updatedData.password);
        updatedData.password = hash;
        await updateUser(mail , updatedData)
        res.json(console.log(req.body.password))
    } catch (error) {
        console.error('erreur updateUser', error.message);
        res.status(500).json({
            message : 'erreur serveur (updateUser)'
        })
        
    }
}