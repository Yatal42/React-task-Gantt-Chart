import React, { useState, useEffect, useRef } from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode, Task } from "gantt-task-react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import AddTask from "./AddTask";

interface ToolBarProps {
    setIsChecked: (checked: boolean) => void; 
    setView: (viewMode: ViewMode) => void; 
    view: ViewMode; 
    isChecked: boolean; 
    tasks: Task[];
    setTasks: (tasks: Task[]) => void; 
}

const ToolBar: React.FC<ToolBarProps>=({setIsChecked, setView, isChecked, view, tasks, setTasks}) =>{
    const prevWidthRef = useRef(window.innerWidth);

    useEffect(() => {
      const handleResize = () => {
        const currentWidth = window.innerWidth;
        const prevWidth = prevWidthRef.current;
        const newIsWideScreen = currentWidth > 1150;
  
        if (
          (prevWidth <= 1150 && currentWidth > 1150) ||
          (prevWidth > 1150 && currentWidth <= 1150)
        ) {
          setIsWideScreen(newIsWideScreen);
        }
  
        prevWidthRef.current = currentWidth;
      };
  
      window.addEventListener("resize", handleResize);
  
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1150);

    const viewsOptions = [
        { value: "Day", onChange: ViewMode.Day },
        { value: "Week", onChange: ViewMode.Week },
        { value: "Month", onChange: ViewMode.Month },];
    
    const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOption = viewsOptions.find((option) => option.value === event.target.value);
    if (selectedOption) 
    {
        setView(selectedOption.onChange); 
    }};

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
        <div
            className="textField-container frame-size"
            style={{
                marginLeft: isWideScreen ? '50px' : '10px',
                marginTop: '0'
            }}>
            <TextField
            id="outlined-select-view"
            select
            sx={{ minWidth: 150 }}
            label="View options"
            size="small"
            value={view}
            onChange={handleViewChange}
            SelectProps={{
                MenuProps: {
                PaperProps: {
                    style: {
                    transform: isWideScreen ? "none" : "scale(0.6)",
                    transformOrigin: "center",
                    },
                },},
            }}>
            {viewsOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.value}
                </MenuItem>
            ))}
            </TextField>
        </div>
        <div
            className="add-task-container frame-size"
            style={{
            marginLeft: isWideScreen ? "50px" : "10px",
            marginTop: "0",
            }}>
            <AddTask
                onTaskAdded={handleTaskAdded}
                tasks={tasks}
                setTasks={setTasks}
            />
        </div>
    </div>    
    );
}


export default ToolBar;