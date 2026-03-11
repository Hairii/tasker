import express from 'express';
import { addTask, editTask, removeTask, fetchTaskById, editTaskName } from '../controllers/task.controller.js';

const router = express.Router();

router.get('/tasks', fetchTaskById);           
router.post('/addtasks', addTask);             
router.put('/puttasks/:id', editTask);        
router.delete('/deletetasks/:id', removeTask); 
router.put('/puttaskname/:id', editTaskName);  

export default router;