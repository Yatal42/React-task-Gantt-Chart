// src/context/ProjectContext.tsx

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

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        // Fetch all projects when the component mounts
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