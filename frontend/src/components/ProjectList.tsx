import React, { useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ProjectList: React.FC = () => {
    const { projects, selectProject, deleteProject } = useContext(ProjectContext);

    const handleDelete = (pid: number) => {
        // CR: the window.confirm is bad user experience, you should use a dialog
        if (window.confirm('Are you sure you want delete this project?')) {
            // CR: this might be an SQL injection, you should validate the input
            // CR: after checking this is indeed an SQL injection
            fetch(`http://localhost:8080/api/projects/${pid}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Project deleted successfully') {
                        deleteProject(pid);
                    } else {
                        alert('Error deleting project ');
                    }
                })
                .catch(error => {
                    console.error('Error deleting project:', error);
                    alert('Error deleting project');
                });
        }
    };

    return (
        <List>
            {projects.map(project => (
                <ListItem key={project.pid} onClick={() => selectProject(project)}>
                    <ListItemText primary={project.title} />
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(project.pid)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItem>
            ))}
        </List>
    );
};

export default ProjectList;