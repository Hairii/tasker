import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

import tasksRoutes from "./routes/task.routes.js";
import authRoutes from './routes/auth.routes.js'
import { verifyToken } from "./middleware/token.middleware.js";

dotenv.config();

const app = express();

app.use(express.json())
app.use(cookieParser());
app.use(cors());
//routes app

//auth
app.use('/api/auth' , authRoutes)
app.use('/api/tasks' , verifyToken , tasksRoutes)
//route front
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, "../../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/html/authenticate.html"));
});

app.get("/dashboard", verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/html/dashboard.html"));
});

app.get("/formulaire", verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/html/formulaire.html"));
});

app.get("/logout" , (req, res) => {
    res.clearCookie('token' , {path : '/'});
    res.redirect('/');
})

export default app;
