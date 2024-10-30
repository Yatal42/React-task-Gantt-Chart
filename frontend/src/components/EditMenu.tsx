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
import useMediaQuery from '@mui/material/useMediaQuery';
import { Task } from "gantt-task-react";
import Box from '@mui/material/Box';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
  },
}));

const StyledButton = styled(Button)<{ fontSize: string, buttonWidth: string }>(({ fontSize, buttonWidth }) => ({
  fontSize: fontSize,
  padding: '5px',
  width: buttonWidth,
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

  const isSmallScreen = useMediaQuery('(max-width:1150px)');
  const titleFontSize = isSmallScreen ? '14px' : '24px';
  const contentFontSize = isSmallScreen ? '11px' : '16px';
  const textFieldHeight = isSmallScreen ? '30px' : '56px';
  const buttonFontSize = isSmallScreen ? '10px' : '14px';
  const buttonWidth = isSmallScreen ? '30%' : '33.33%';

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
          dependencies: selectedDependencies,
          progress: selectedTask.progress 
      };

      const formattedStart = taskStart.toISOString().split('T')[0];
      const formattedEnd = taskEnd.toISOString().split('T')[0];

      fetch(`http://localhost:8080/api/tasks/${selectedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskName,
          startdate: formattedStart,
          deadline: formattedEnd,
          pid: selectedTask.project, 
          dependencies: selectedDependencies,
          progress: selectedTask.progress,
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
        <DialogTitle sx={{ m: 0, p: 1, fontSize: titleFontSize}}>Edit selected task</DialogTitle>
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
          <Typography gutterBottom sx={{ fontSize: contentFontSize }}>
            Edit task details below.
          </Typography>
          <TextField
              label="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
                style: { fontSize: contentFontSize }
              }}
              InputProps={{
                  style: { height: textFieldHeight, fontSize: contentFontSize }
              }}
              sx={{
                  width: '100%',
                  mb: isSmallScreen ? 0.5 : 2
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
                style: { fontSize: contentFontSize }
              }}
              InputProps={{
                  style: { height: textFieldHeight, fontSize: contentFontSize }
              }}
              sx={{
                  width: '100%',
                  mb: isSmallScreen ? 0.5 : 2
              }}
          />
        </DialogContent>
        <DialogActions>
                <Box sx={{
                    display: 'flex',
                    width: '100%',
                    margin: '0 auto',
                    gap: isSmallScreen ? `${14.5}%` : `${16}%`,
                    alignItems: isSmallScreen ? 'center' : 'initial',
                }}>
                    <StyledButton
                        text="Edit dependencies"
                        onClick={handleEditDependencies}
                        fontSize={buttonFontSize}
                        buttonWidth={buttonWidth}
                    />
                    <StyledButton
                        text="Delete this task"
                        onClick={handleDelete}
                        fontSize={buttonFontSize}
                        buttonWidth={buttonWidth}
                    />
                    <StyledButton
                        text="Save"
                        onClick={handleSave}
                        fontSize={buttonFontSize}
                        buttonWidth={buttonWidth}
                    />
                </Box>
            </DialogActions>
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