import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, FormControlLabel, Checkbox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Task } from "gantt-task-react";

interface EditDependenciesProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
  selectedTask: Task;
  selectedDependencies: string[];
  handleDependencySelection: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditDependencies: React.FC<EditDependenciesProps> = ({
  open,
  onClose,
  tasks,
  selectedTask,
  selectedDependencies,
  handleDependencySelection,
}) => {
  const availableTasks = tasks.filter(task => task.project === selectedTask.project && task.id !== selectedTask.id);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontSize: "15px", padding: "15px" }}>Dependencies</DialogTitle>
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
      <DialogContent>
        {availableTasks.length === 0 ? (
          <p>No other tasks available in this project.</p>
        ) : (
          availableTasks.map(task => (
            <FormControlLabel
              key={task.id}
              control={
                <Checkbox
                  checked={selectedDependencies.includes(task.id)}
                  onChange={handleDependencySelection}
                  value={task.id}
                  color="secondary"
                />
              }
              label={task.name}
            />
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditDependencies;