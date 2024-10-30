import React, { useState, useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Button from "./Button";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const AddProject: React.FC = () => {
    const { addProject } = useContext(ProjectContext);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setTitle('');
        setStart('');
    };

    const handleSubmit = () => {
        if (!title || !start) {
            alert('Please fill all the fields');
            return;
        }

        fetch('http://localhost:8080/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, start }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.projectId) {
                    addProject({ pid: data.projectId, title, start });
                    handleClose();
                } else {
                    alert('Error creating new project');
                }
            })
            .catch(error => {
                console.error('Error adding project:', error);
                alert('Error creating new project');
            });
    };

    return (
        <>
            <Button text="Add project " onClick={handleOpen} />
            <Dialog open={open} onClose={handleClose} >
                <DialogTitle>Add new project</DialogTitle>
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
                <DialogContent dividers sx={{display:'flex', flexDirection:'column'}}>
                    <TextField
                        margin="normal"
                        label="Project name"
                        type="text"
                        color="secondary"
                        sx={{ minWidth: 300}}
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        label="start date"
                        type="date"
                        color="secondary"
                        sx={{ minWidth: 300}}
                        required
                        InputLabelProps={{ shrink: true }}
                        value={start}
                        onChange={e => setStart(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{display:'flex', justifyContent:'center'}}>
                    <Button text="Add" onClick={handleSubmit} />
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddProject;