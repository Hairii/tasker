import {
  createTask,
  updateTask,
  deleteTask,
  getTasksByUserId,
  getTaskById,
  updateTaskName,
} from "../models/task.model.js";
import { taskSchema } from "../validations/task.validation.js";

// recuperer les taches
export const fetchTaskById = async (req, res) => {
  try {
    const id = req.user.id;
    const task = await getTasksByUserId(id);
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (fetchTaskById)" });
  }
};

// creer une tache
export const addTask = async (req, res) => {
  try {
    const { name } = req.body;
    const id = req.user.id;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Le nom ne peut pas être vide" });
    }
    const { error } = taskSchema.validate({ name });
    if (error) {
      return res.status(400).json({ message: "la tache ne peut pas faire plus de 50 caractères" });
    }

    await createTask({ name, user_id: id });
    res.status(201).json({ message: "Tache créée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (addTask)" });
  }
};

// changer le statut d'une tache
export const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await getTaskById(id);
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    if (task.user_id !== req.user.id) return res.status(403).json({ message: "Interdit" });

    await updateTask(id, { status });
    res.json({ message: "tache modifiée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (editTask)" });
  }
};

// changer le nom d'une tache
export const editTaskName = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const task = await getTaskById(id);
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    if (task.user_id !== req.user.id) return res.status(403).json({ message: "Interdit" });

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Le nom ne peut pas être vide" });
    }
    const { error } = taskSchema.validate({ name });
    if (error) {
      return res.status(400).json({ message: "la tache ne peut pas faire plus de 50 caractères" });
    }

    await updateTaskName(id, name);
    res.json({ message: "Nom de la tâche modifié" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (editTaskName)" });
  }
};

// supprimer tache
export const removeTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await getTaskById(id);
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    if (task.user_id !== req.user.id) return res.status(403).json({ message: "Interdit" });

    await deleteTask(id);
    res.json({ message: "Tâche supprimée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur (removeTask)" });
  }
};