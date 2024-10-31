import React, {useContext } from "react";
import { ProjectContext } from "../../context/ProjectContext";
import "gantt-task-react/dist/index.css";
import { ViewMode, Task } from "gantt-task-react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import AddTask from "../AddTask";
import ProjectSelector from "../ProjectSelector"
import AddProject from "../AddProject"
import Button from "../Button/Button"
import './ToolBar.css'

interface ToolBarProps {
    setIsChecked: (checked: boolean) => void; 
    setView: (viewMode: ViewMode) => void; 
    view: ViewMode; 
    isChecked: boolean; 
    tasks: Task[];
    setTasks: (tasks: Task[]) => void; 
}

const ToolBar: React.FC<ToolBarProps>=({setIsChecked, setView, isChecked, view, tasks, setTasks}) =>{
    const { selectedProject, deleteProject } = useContext(ProjectContext);

    const viewsOptions = [
        { value: "Week", onChange: ViewMode.Week },
        { value: "Month", onChange: ViewMode.Month },
    ];
    
    const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOption = viewsOptions.find((option) => option.value === event.target.value);
    if (selectedOption) 
    {
        setView(selectedOption.onChange); 
    }};

    const handleDeleteProject = async () => {
        if (!selectedProject|| selectedProject.pid === 0) {
          alert('No project selected');
          return;
        }
        const confirmed = window.confirm(`Are you sure you want to delete project "${selectedProject.title}"?`);
        if (confirmed) {
          await deleteProject(selectedProject.pid);
        }
      };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    };

    const handleTaskAdded = (newTask: Task) => {
    setTasks([...tasks, newTask]); 
    };

    return(
    <div className="tool-bar">
            <div className="Switch">
                <label className="Switch_Toggle">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleChange}/>
                </label>
            Show Task List
            </div>
            <TextField
            id="outlined-select-view"
            select
            color="secondary"
            sx={{ minWidth: 120, fontSize: 5 }}
            label="View options"
            size="small"
            value={view}
            onChange={handleViewChange}>
            {viewsOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.value}
                </MenuItem>
            ))}
            </TextField>
            <ProjectSelector />
            <Button text="Delete Project" onClick={handleDeleteProject} />
            <AddTask
                onTaskAdded={handleTaskAdded}
                tasks={tasks}
                setTasks={setTasks}
            />
            <AddProject />

    </div>    
    );
}


export default ToolBar;