import React, { useState, useContext } from "react";
import Button from "./Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Task } from "gantt-task-react";
import { ProjectContext } from '../context/ProjectContext';

interface AddTaskProps {
  onTaskAdded: (task: Task) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onTaskAdded, tasks, setTasks }) => {
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [taskStart, setTaskStart] = useState<string>("");
  const [taskEnd, setTaskEnd] = useState<string>("");

  const { selectedProject } = useContext(ProjectContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset all fields when closing the dialog
    setTaskName("");
    setDescription("");
    setTaskStart("");
    setTaskEnd("");
  };

  const handleAddTask = async () => {
    try {
      if (!selectedProject) {
        alert("No project selected.");
        return;
      }

      // Use project's start date if taskStart is empty
      const startDateString = taskStart || selectedProject.start;
      const startDate = new Date(startDateString);

      // Use start date plus one day if taskEnd is empty
      const endDateString = taskEnd || new Date(startDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const endDate = new Date(endDateString);

      // Send the task data to the server
      const response = await fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskName,
          startdate: startDate.toISOString().split('T')[0],
          deadline: endDate.toISOString().split('T')[0],
          pid: selectedProject.pid,
          descriptionText: description,
          dependencies: [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      // Parse the server response to get the new task data
      const data = await response.json();

      // Create the new task object
      const newTask: Task = {
        id: data.taskId.toString(),
        name: taskName,
        start: startDate,
        end: endDate,
        type: "task",
        progress: 0,
        dependencies: [],
        project: selectedProject.pid.toString(),
        // descriptionText: description,
        styles: {
          progressColor: "#3e2d47",
          progressSelectedColor: "#3e2d47",
        },
      };

      // Add the new task to the task list
      setTasks([...tasks, newTask]);
      console.log("Added new task:", newTask);

      // Notify the parent component that a task was added
      onTaskAdded(newTask);

      // Reset all fields after adding the task
      setTaskName("");
      setDescription("");
      setTaskStart("");
      setTaskEnd("");

      handleClose(); // Close the dialog after adding the task
    } catch (error) {
      console.error("Error adding task:", error);
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
          {/* Input field for Task Name */}
          <TextField
            label="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            fullWidth
            margin="normal"
          />
          {/* Input field for Task Description */}
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
          />
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