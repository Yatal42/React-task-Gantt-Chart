import React, { useState } from 'react';
import Button from "./Button";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const EditMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [noTaskDialogOpen, setNoTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);  // Manage selectedTask internally

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

  const handleAddDependencies = () => {};

  const handleDeleteDependencies = () => {};

  const handleDelete = () => {};

  const handleSave = () => {};

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
            פה אנחנו הולכים להכניס עריכת תאריכים, עריכת שם משימה.
            אם לא נבחרה משימה, יש להוציא פופ אפ של- ״לא נבחרה משימה״ במקום הדיאלוג הזה.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ margin: 0, justifyContent: 'space-between' }}>
          <Button text={"Add dependencie"} onClick={handleAddDependencies} />
          <Button text={"Delete dependencie"} onClick={handleDeleteDependencies} />
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
