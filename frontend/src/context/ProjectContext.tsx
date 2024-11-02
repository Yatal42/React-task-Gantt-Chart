import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '../types';

export interface ProjectContextProps {
    projects: Project[];
    selectedProject: Project | null;
    selectProject: (project: Project | null) => void;
    addProject: (project: Project) => void;
    updateProject: (project: Project) => void;
    deleteProject: (pid: number) => Promise<void>; 
}

export const ProjectContext = createContext<ProjectContextProps>({
    projects: [],
    selectedProject: null,
    selectProject: () => {},
    addProject: () => {},
    updateProject: () => {},
    deleteProject: async () => {},
});

// CR: This is bad paractice, use Redux
export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        // CR: The fetch should be in a separate function, not in the useEffect
        // CR: The URL is hardcoded, this is usually not a good practice, but forgivable in this case
        // CR: There is no separation of concerns in your project, making it that the fetch happens where logic happens,
        //     this shuold be separated into a service or a hook
        fetch('http://localhost:8080/api/projects')
            .then(response => response.json())
            .then(data => {
                setProjects(data);
    
                const savedProjectId = localStorage.getItem('selectedProjectId');
                if (savedProjectId) {
                    const savedProject = data.find((project: Project) => project.pid.toString() === savedProjectId);
                    if (savedProject) {
                        setSelectedProject(savedProject);
                    } else if (data.length > 0) {
                        setSelectedProject(data[0]);
                    }
                    // CR: You check for the same condition twice, this can be simplified
                } else if (data.length > 0) {
                    setSelectedProject(data[0]);
                }
            })
            .catch(error => console.error('Error fetching projects:', error));
    }, []);

    const selectProject = (project: Project | null) => {
        setSelectedProject(project);
        if (project) {
            localStorage.setItem('selectedProjectId', project.pid.toString());
        } else {
            localStorage.removeItem('selectedProjectId');
        }
    };

    const addProject = (project: Project) => {
        setProjects(prevProjects => [...prevProjects, project]);
    };

    const updateProject = (updatedProject: Project) => {
        setProjects(prevProjects =>
            prevProjects.map(project => (project.pid === updatedProject.pid ? updatedProject : project))
        );
    };


const deleteProject = async (pid: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${pid}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
  
      setProjects(prevProjects => prevProjects.filter(project => project.pid !== pid));
  
      if (selectedProject?.pid === pid) {
        setSelectedProject(null);
        localStorage.removeItem('selectedProjectId');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      // CR: Remove the alerts it is bad user experience
      alert('Failed to delete project. Please try again.');
    }
  };

    return (
        <ProjectContext.Provider
            value={{ projects, selectedProject, selectProject, addProject, updateProject, deleteProject }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

export {};