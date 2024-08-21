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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
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
  open: boolean;
  onClose: () => void;
  selectedTask: Task | null;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const EditMenu: React.FC<EditMenuProps> = ({ open, onClose, selectedTask, tasks, setTasks }) => {
  const [taskName, setTaskName] = useState('');
  const [taskStart, setTaskStart] = useState(new Date());
  const [taskEnd, setTaskEnd] = useState(new Date());
  const [dependencyDialogOpen, setDependencyDialogOpen] = useState(false);
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>([]);

  useEffect(() => {
    if (selectedTask) {
      setTaskName(selectedTask.name);
      setTaskStart(selectedTask.start);
      setTaskEnd(selectedTask.end);
      setSelectedDependencies(selectedTask.dependencies || []);
      console.log('Selected task set:', selectedTask);
    }
  }, [selectedTask]);

  const handleEditDependencies = () => {
    setDependencyDialogOpen(true);
  };

  const handleDependencySelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTaskId = event.target.value;
    setSelectedDependencies((prev) => {
      if (prev.includes(selectedTaskId)) {
        return prev.filter(dep => dep !== selectedTaskId); // Remove task from dependencies
      } else {
        return [...prev, selectedTaskId]; // Add task to dependencies
      }
    });
  };

  const handleSave = () => {
    if (selectedTask) {
      const updatedTask = { 
        ...selectedTask, 
        name: taskName, 
        start: taskStart, 
        end: taskEnd,
        dependencies: selectedDependencies 
      };

      fetch(`http://localhost:8080/api/tasks/${selectedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nameAndTitle: taskName,
          start: taskStart,
          end: taskEnd,
          dependencies: selectedDependencies,
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error updating task');
        }
        return response.json();
      })
      .then(result => {
        setTasks(tasks.map(task => task.id === selectedTask.id ? updatedTask : task));
        onClose();
      })
      .catch(error => {
        console.error('Error updating task:', error);
      });
    }
  };

  const handleDelete = () => {
    if (selectedTask) {
      fetch(`http://localhost:8080/api/tasks/${selectedTask.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(result => {
        console.log('Task delete result:', result);
        setTasks(tasks.filter(task => task.id !== selectedTask.id));
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      })
      .finally(() => {
        onClose();
      });
    }
  };

  return (
      <BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }}>Edit selected task</DialogTitle>
        <IconButton
            aria-label="close"
            onClick={onClose}
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
          {/* <TextField
              label="Start Date"
              type="date"
              value={taskStart.toISOString().split('T')[0]}
              //onChange={(e) => setTaskStart(new Date(e.target.value))}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
          /> */} 
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
        {/* Dependency Dialog */}
        <Dialog open={dependencyDialogOpen} onClose={() => setDependencyDialogOpen(false)}>
          <DialogTitle>Select Dependencies</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setDependencyDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
          <DialogContent>
            {tasks
              .filter(task => task.project === selectedTask?.project && task.id !== selectedTask?.id)
              .map(task => (
                <FormControlLabel
                  key={task.id}
                  control={
                    <Checkbox
                      checked={selectedDependencies.includes(task.id)}
                      onChange={handleDependencySelection}
                      value={task.id}
                    />
                  }
                  label={task.name}
                />
              ))}
          </DialogContent>
        </Dialog>
      </BootstrapDialog>
  );
};

export default EditMenu;