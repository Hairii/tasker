import db from "../config/db.js";

export const getAllTasks = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM task")
        return rows;
    } catch (error) {
        console.error("erreur getAllTasks" , error.message);
        throw error;
    }
}

export const getTasksByUserId = async (user_id) => {
    try {
        const rows = await db.query("SELECT * FROM task WHERE user_id = ?", [user_id]);
        return rows[0];
    } catch (error) {
        console.error("erreur getTasksByUserId", error.message);
        throw error;
    }
}

export const createTask = async ({ name, user_id }) => {
    try {
        await db.query("INSERT INTO task (name, status , user_id) VALUES (?, ?, ?)",
            [name, false, user_id]
        )
    } catch (error) {
        console.error("erreur createTask", error.message);
        throw error;
    }
}

export const deleteTask = async (id) => {
    try {
        const [result] = await db.query("DELETE FROM task WHERE id = ?",
            [id]
        )
        return result.affectedRows > 0;
    } catch (error) {
    console.error("erreur deleteTask", error.message);
    throw error;
}
}

export const updateTask = async (id, { status}) => {
    try {
        await db.query("UPDATE task SET status = ? WHERE id = ?",
            [ status, id]
        )
    } catch (error) {
        console.error("erreur updateTask", error.message);
        throw error;
    }
};


export const updateTaskName = async (id, name) =>{
    try{
        await db.query("UPDATE task SET name = ?WHERE id = ?", [name,id])
    }
    catch (error){
        console.error("erreur updateTaskName", error.message);
        throw error;
    }

}