import React, { useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import { TextField, MenuItem} from '@mui/material';
import { Project } from '../types';

const ProjectSelector: React.FC = () => {
    const { projects, selectedProject, selectProject } = useContext(ProjectContext);

    const handleChange = (event: any) => {
        // CR: if the value is actually null this will break
        const pid = event.target.value === 'null' ? null : Number(event.target.value);
        
        if (pid === 0) {
            selectProject({
                pid: 0,
                title: 'All Tasks',
                start: new Date().toISOString(), 
                end: new Date().toISOString(),
            } as Project);
        } else if (pid === null) {
            selectProject(null); 
        } else {
            const project = projects.find((p: Project) => p.pid === pid) || null;
            selectProject(project);
        }
    };

    return (
            <TextField
                select
                size="small"
                id="project-select-label"
                color="secondary"
                value={selectedProject?.pid?.toString() ?? 'null'}
                onChange={handleChange}
                label="Select project"
                sx={{ minWidth: 120, fontSize: 5 }}>
                <MenuItem value={0}>All Tasks</MenuItem> 
                <MenuItem value="null">No Project Selected</MenuItem> 
                {projects.map((project: Project) => (
                    <MenuItem key={project.pid} value={project.pid}>
                        {project.title}
                    </MenuItem>
                ))}
            </TextField>
    );
};

export default ProjectSelector;