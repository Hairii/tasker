import express from 'express';
import { fetchTasks, addTask , editTask , removeTask , fetchTaskById, editTaskName  } from '../controllers/task.controller.js';

const router = express.Router();

router.get('/tasks', fetchTasks);
router.get('/tasks/:id' , fetchTaskById)
router.post('/addtasks/:id', addTask);
router.put('/puttasks/:id', editTask);
router.delete('/deletetasks/:id', removeTask);
router.put('/puttaskname/:id', editTaskName);
export default router;