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
  onTaskAdded: (task: any) => void; // Callback function to notify the parent component when a task is added
  tasks: Task[]; // Array of current tasks in the Gantt chart
  setTasks: (tasks: Task[]) => void; // Function to update the task list in the parent component
}

// The AddTask component provides a dialog to add new tasks to the Gantt chart.
const AddTask: React.FC<AddTaskProps> = ({ onTaskAdded, tasks, setTasks }) => {
  const [open, setOpen] = useState(false); // State to control the dialog visibility
  // State to manage task inputs
  const [taskName, setTaskName] = useState<string>(""); 
  const [taskId, setTaskId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [description, setDescription] = useState<string>(""); 
  const [taskStart, setTaskStart] = useState<string>(new Date().toISOString().split('T')[0]);
  const [taskEnd, setTaskEnd] = useState<string>(new Date().toISOString().split('T')[0]); 
  const [taskDescriptions, setTaskDescriptions] = useState<{ [key: string]: string }>({}); 

  // Function to open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Handle the addition of a new task
  const handleAddTask = async () => {
    try {
      const startDate = new Date(taskStart); // Convert task start date string to Date object
      const endDate = new Date(taskEnd); // Convert task end date string to Date object
      console.log(`task name is ${taskName}`); // Log the task name for debugging

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

      // Parse the server response to get the new task data
      const newTask = await response.json(); 

      // Update the tasks state with the new task
      const updatedTask = {
        id: newTask.id,
        name: taskName,
        start: startDate,
        end: endDate,
        type: "task" as "task", // Type of the task, set to "task"
        progress: 0, // Initial progress set to 0
        dependencies: [], // No dependencies by default
        project: newTask.pid,
        isDisabled: false,
        styles: {
          progressColor: "#176B87",
          progressSelectedColor: "#176B87",
        },
      };
      // Add the new task to the task list
      setTasks([...tasks, updatedTask]); 
      console.log("Updated tasks:", updatedTask); 

      // Store the description separately, keyed by task ID
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

      handleClose(); // Close the dialog after adding the task
    } catch (error) {
      console.error("Error adding task:", error); // Log any errors that occur during task addition
    }
  };

  return (
    <>
      {/* Button to open the Add Task dialog */}
      <Button text="Add Task" onClick={handleClickOpen} />
      {/* Dialog for adding a new task */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          {/* Input field for Task ID */}
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="task-id">Task ID</InputLabel>
            <Input
              id="task-id"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
            />
          </FormControl>
          {/* Input field for Project ID */}
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="project-id">Project ID</InputLabel>
            <Input
              id="project-id"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
          </FormControl>
          {/* Input field for Task Name */}
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="task-name">Task Name</InputLabel>
            <Input
              id="task-name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </FormControl>
          {/* Input field for Task Description */}
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="task-description">Description</InputLabel>
            <Input
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          {/* Input field for Task Start Date */}
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
          {/* Input field for Task End Date */}
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
        {/* Dialog actions: Cancel and Add Task buttons */}
        <DialogActions>
          <Button onClick={handleClose} text="Cancel" />
          <Button onClick={handleAddTask} text="Add Task" />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddTask;