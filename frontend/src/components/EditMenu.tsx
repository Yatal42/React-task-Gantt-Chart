import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Button from "./Button/Button";
import { Task } from "gantt-task-react";
import EditDependencies from './EditDependencies';

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
    const otherTasksInProject = tasks.filter(
        task => task.project === selectedTask?.project && task.id !== selectedTask?.id
    );

    if (otherTasksInProject.length === 0) {
        alert("There are no other tasks in this project.");
        return;
    }

    setDependencyDialogOpen(true);
};

  const handleDependencySelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTaskId = event.target.value;
    setSelectedDependencies((prev) => {
      if (prev.includes(selectedTaskId)) {
        return prev.filter(dep => dep !== selectedTaskId);
      } else {
        return [...prev, selectedTaskId];
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
 
  // CR: you should create an anstract Dialog component that you can reuse, and only change the content
  return (
    <>
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>Edit selected task</DialogTitle>
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
            color="secondary"
            onChange={(e) => setTaskName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            type="date"
            color="secondary"
            value={taskEnd.toISOString().split('T')[0]}
            onChange={(e) => setTaskEnd(new Date(e.target.value))}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <Button
            text="Edit dependencies"
            onClick={handleEditDependencies}
          />
          <Button
            text="Delete this task"
            onClick={handleDelete}
          />
          <Button
            text="Save"
            onClick={handleSave}
          />
        </DialogActions>
      </Dialog>
      {selectedTask && (
        <EditDependencies
          open={dependencyDialogOpen}
          onClose={() => setDependencyDialogOpen(false)}
          tasks={tasks}
          selectedTask={selectedTask!}
          selectedDependencies={selectedDependencies}
          handleDependencySelection={handleDependencySelection}
        />
      )}
    </>
  );
};

export default EditMenu;