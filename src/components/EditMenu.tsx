import React, { useState, useEffect } from 'react';
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
    const [taskName, setTaskName] = useState('');
    const [taskStart, setTaskStart] = useState(new Date());
    const [taskEnd, setTaskEnd] = useState(new Date());

    useEffect(() => {
        if (selectedTask) {
            setTaskName(selectedTask.name);
            setTaskStart(selectedTask.start);
            setTaskEnd(selectedTask.end);
            console.log('Selected task set:', selectedTask);
        }
    }, [selectedTask]);

    const handleClickOpen = () => {
        if (!selectedTask) {
            setNoTaskDialogOpen(true);
        } else {
            setOpen(true);
            setTaskName(selectedTask.name);
            setTaskStart(selectedTask.start);
            setTaskEnd(selectedTask.end);
            console.log('Dialog opened with selected task:', selectedTask);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNoTaskDialogClose = () => {
        setNoTaskDialogOpen(false);
    };

    const handleEditDependencies = () => {
        // TODO: Add logic for editing dependencies
        console.log('Add Dependencies');
    };

    const handleDelete = () => {
        if (selectedTask) {
            console.log('Preparing to delete task:', selectedTask.id);
            fetch(`/api/tasks/${selectedTask.id}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.text();
                })
                .then(result => {
                    console.log('Task deleted result:', result);
                    setTasks(tasks.filter(task => task.id !== selectedTask.id));
                    handleClose();
                })
                .catch(error => {
                    console.error('Error deleting task:', error);
                });
        }
    };

    const handleSave = () => {
        if (selectedTask) {
            const updatedTask = { ...selectedTask, name: taskName, start: taskStart, end: taskEnd };

            console.log('Preparing to update task:', updatedTask);

            fetch(`/api/tasks/${selectedTask.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nameAndTitle: taskName,
                    start: taskStart,
                    end: taskEnd,
                    dependencies: selectedTask.dependencies || [],
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(result => {
                    console.log('Task update result:', result);
                    setTasks(tasks.map(task => task.id === selectedTask.id ? updatedTask : task));
                    handleClose();
                })
                .catch(error => {
                    console.error('Error updating task:', error);
                });
        }
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
                    <Button text={"Add dependency"} onClick={handleEditDependencies} />
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