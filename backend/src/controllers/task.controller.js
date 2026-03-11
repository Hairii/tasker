import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTasksByUserId,
  updateTaskName,
} from "../models/task.model.js";
import { taskSchema } from "../validations/task.validation.js";
// recuperer les taches
export const fetchTasks = async (req, res) => {
  try {
    const task = await getAllTasks();
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (fetchTask)" });
  }
};

export const fetchTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await getTasksByUserId(id);
    console.log(id);
    if (!task) {
      return res.status(404).json({ message: "task non trouvée" });
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (fetchTaskById)" });
  }
};

//creer une tache
export const addTask = async (req, res) => {
  try {
    const { name } = req.body;
    const id = req.params.id;
    const { error } = taskSchema.validate({ name });
    if (error) {
      return res
        .status(400)
        .json({ message: "la tache ne peut pas faire plus de 50 caractères" });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Le nom ne peut pas être vide" });
    }
    await createTask({ name, user_id: id });
    console.log(id, name);
    res.status(201).json({ message: "Tache créée", id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (addTask)" });
  }
};

// changer une tache
export const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    await updateTask(id, { status });
    res.json({ message: "tache modifiée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (editTask)" });
  }
};

//changer le nom d'une tache
export const editTaskName = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Le nom ne peut pas être vide" });
    }
    const { error } = taskSchema.validate({ name });
    if (error) {
      return res
        .status(400)
        .json({ message: "la tache ne peut pas faire plus de 50 caractères" });
    }

    await updateTaskName(id, name);
    res.json({ message: "Nom de la tâche modifié" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: " Erreur serveur (editTaskName)" });
  }
};

//supprimer tache
export const removeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteTask(id);
    if (!deleted) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json({ message: "Tâche supprimée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur removeTask" });
  }
};
