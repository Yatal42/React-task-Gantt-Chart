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
    if (!selectedProject || selectedProject.pid === 0) {
      alert("Please select a project first.");
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTaskName("");
    setDescription("");
    setTaskStart("");
    setTaskEnd("");
  };

  const handleAddTask = async () => {
    try {
      const startDateString = taskStart || selectedProject!.start;
      const startDate = new Date(startDateString);

      const endDateString =
        taskEnd ||
        new Date(
          startDate.getTime() + 24 * 60 * 60 * 1000
        ).toISOString().split("T")[0];
      const endDate = new Date(endDateString);

      const response = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskName,
          startdate: startDate.toISOString().split("T")[0],
          deadline: endDate.toISOString().split("T")[0],
          pid: selectedProject!.pid,
          descriptionText: description,
          dependencies: [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const data = await response.json();

      const newTask: Task = {
        id: data.taskId.toString(),
        name: taskName,
        start: startDate,
        end: endDate,
        type: "task",
        progress: 0,
        dependencies: [],
        project: selectedProject!.pid.toString(),
        styles: {
          progressColor: "#83217d",
          progressSelectedColor: "#83217d",
        },
      };

      setTasks([...tasks, newTask]);
      console.log("Added new task:", newTask);

      onTaskAdded(newTask);

      setTaskName("");
      setDescription("");
      setTaskStart("");
      setTaskEnd("");

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
          <TextField
            label="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            fullWidth
            margin="normal"/>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline/>
          <TextField
            label="Start Date"
            type="date"
            value={taskStart}
            onChange={(e) => setTaskStart(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}/>
          <TextField
            label="End Date"
            type="date"
            value={taskEnd}
            onChange={(e) => setTaskEnd(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}/>
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