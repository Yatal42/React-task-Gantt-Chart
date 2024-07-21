import React, { useState } from 'react';
import Button from "./Button";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Task } from "gantt-task-react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
  },
}));

interface EditMenuProps {
  selectedTask: Task | null;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const EditMenu: React.FC<EditMenuProps> = ({ selectedTask, tasks, setTasks }) => {
  const [open, setOpen] = useState(false);
  const [noTaskDialogOpen, setNoTaskDialogOpen] = useState(false);
  const [taskName, setTaskName] = useState(selectedTask?.name || '');
  const [taskStart, setTaskStart] = useState(selectedTask?.start || new Date());
  const [taskEnd, setTaskEnd] = useState(selectedTask?.end || new Date());

  const handleClickOpen = () => {
    if (!selectedTask) {
      setNoTaskDialogOpen(true);
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNoTaskDialogClose = () => {
    setNoTaskDialogOpen(false);
  };

  const handleAddDependencies = () => {
    //TODO
    console.log('Add Dependencies');
  };

  const handleDeleteDependencies = () => {
    // if (selectedTask) {
    //   const updatedTask = { ...selectedTask, dependencies: [] };
    //   setTasks(tasks.map(task => task.id === selectedTask.id ? updatedTask : task));
    // }
    // console.log('Delete Dependencies');
  };

  const handleDelete = () => {
    if (selectedTask) {
      setTasks(tasks.filter(task => task.id !== selectedTask.id));
      handleClose();
    }
    console.log('Delete Task');
  };

  const handleSave = () => {
    if (selectedTask) {
      const updatedTask = { ...selectedTask, name: taskName, start: taskStart, end: taskEnd };
      setTasks(tasks.map(task => task.id === selectedTask.id ? updatedTask : task));
      handleClose();
    }
    console.log('Save Task');
  };

  return (
    <React.Fragment>
      <Button text={"Edit task"} onClick={handleClickOpen} />
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }}>Edit selected task</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            Edit task details below.
          </Typography>
          <TextField
            label="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            type="date"
            value={taskStart.toISOString().split('T')[0]}
            onChange={(e) => setTaskStart(new Date(e.target.value))}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Date"
            type="date"
            value={taskEnd.toISOString().split('T')[0]}
            onChange={(e) => setTaskEnd(new Date(e.target.value))}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ margin: 0, justifyContent: 'space-between' }}>
          <Button text={"Add dependency"} onClick={handleAddDependencies} />
          <Button text={"Delete dependencies"} onClick={handleDeleteDependencies} />
          <Button text={"Delete this task"} onClick={handleDelete} />
          <Button text={"Save"} onClick={handleSave} />
        </DialogActions>
      </BootstrapDialog>
      <BootstrapDialog onClose={handleNoTaskDialogClose} aria-labelledby="no-task-dialog-title" open={noTaskDialogOpen}>
        <DialogTitle id="no-task-dialog-title">No Task Selected</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            There is no selected task, please select one.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button text={"OK"} onClick={handleNoTaskDialogClose} />
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default EditMenu;
