import React, { useState } from "react";
import Button from "./Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Task } from "gantt-task-react";

// Define the props interface for the AddTask component.
interface AddTaskProps {
  onTaskAdded: (task: any) => void; 
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

// The AddTask component provides a dialog to add new tasks to the Gantt chart.
const AddTask: React.FC<AddTaskProps> = ({ onTaskAdded, tasks, setTasks }) => {
  const [open, setOpen] = useState(false); // State to control the dialog visibility
  const [taskName, setTaskName] = useState<string>(""); // State for task name
  const [taskId, setTaskId] = useState<string>(""); // State for task ID
  const [projectId, setProjectId] = useState<string>(""); // State for project ID
  const [description, setDescription] = useState<string>(""); // State for task description
  const [taskStart, setTaskStart] = useState<string>(new Date().toISOString().split('T')[0]); // State for task start date
  const [taskEnd, setTaskEnd] = useState<string>(new Date().toISOString().split('T')[0]); // State for task end date
  const [taskDescriptions, setTaskDescriptions] = useState<{ [key: string]: string }>({}); // State to store task descriptions separately

  // Open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Handle the addition of a new task
  const handleAddTask = async () => {
      try {
        const startDate = new Date(taskStart); 
        const endDate = new Date(taskEnd);     
        console.log(`task name is ${taskName}`); 
        
        // Send the task data to the server
        const response = await fetch('http://localhost:8080/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: taskId,
            nameAndTitle: taskName,
            start: startDate,   
            end: endDate,       
            pid: projectId,
            descriptionText: description,
            dependencies: [],
          }),
        });
    
        if (!response.ok) {
          throw new Error("Failed to add task");
        }
    
        const newTask = await response.json();

      // Update the tasks state with the new task
      const updatedTask = {
          id: newTask.id,
          name: taskName,
          start: startDate,
          end: endDate,
          type: "task" as "task",
          progress: 0,
          dependencies: [],
          project: newTask.pid,
          isDisabled: false,
          styles: {
            progressColor: "#176B87",
            progressSelectedColor: "#176B87",
          },
        };

        setTasks([...tasks, updatedTask]);
        console.log("Updated tasks:", updatedTask); 

        // Store the description separately
        setTaskDescriptions({
          ...taskDescriptions,
          [newTask.id]: newTask.description,
        });

        // Notify the parent component that a task was added
        onTaskAdded(updatedTask);
    
        // Reset all text fields after adding the task
        setTaskName("");
        setTaskId("");
        setProjectId("");
        setDescription("");
        setTaskStart(new Date().toISOString().split('T')[0]);
        setTaskEnd(new Date().toISOString().split('T')[0]);

        handleClose();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    };

  return (
    <>
      <Button text="Add Task" onClick={handleClickOpen} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="task-id">Task ID</InputLabel>
            <Input
              id="task-id"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="project-id">Project ID</InputLabel>
            <Input
              id="project-id"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="task-name">Task Name</InputLabel>
            <Input
              id="task-name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="task-description">Description</InputLabel>
            <Input
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <TextField
            label="Start Date"
            type="date"
            value={taskStart}
            onChange={(e) => setTaskStart(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Date"
            type="date"
            value={taskEnd}
            onChange={(e) => setTaskEnd(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} text="Cancel" />
          <Button onClick={handleAddTask} text="Add Task" />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddTask;