import React, { useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import { TextField, MenuItem, FormControl } from '@mui/material';
import { Project } from '../types';

const ProjectSelector: React.FC = () => {
    const { projects, selectedProject, selectProject } = useContext(ProjectContext);

    const handleChange = (event: any) => {
        const pid = event.target.value === 'null' ? null : Number(event.target.value);
        
        if (pid === 0) {
            selectProject({
                pid: 0,
                title: 'All Tasks',
                start: new Date().toISOString(), // או ערך ברירת מחדל אחר
                end: new Date().toISOString(),
            } as Project);
        } else if (pid === null) {
            selectProject(null); // בחירה ללא פרויקט מסוים
        } else {
            const project = projects.find((p: Project) => p.pid === pid) || null;
            selectProject(project);
        }
    };

    return (
        <FormControl fullWidth>
            <TextField
                select
                sx={{ minWidth: 150 }}
                size="small"
                id="project-select-label"
                value={selectedProject?.pid?.toString() ?? 'null'}
                onChange={handleChange}
                label="Select project"
            >
                <MenuItem value={0}>Show All Tasks</MenuItem> 
                <MenuItem value="null">No Project Selected</MenuItem> 
                {projects.map((project: Project) => (
                    <MenuItem key={project.pid} value={project.pid}>
                        {project.title}
                    </MenuItem>
                ))}
            </TextField>
        </FormControl>
    );
};

export default ProjectSelector;