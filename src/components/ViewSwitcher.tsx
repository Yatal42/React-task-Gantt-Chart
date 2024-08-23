import React, { useState, useEffect, useRef } from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode, Task } from "gantt-task-react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import AddTask from "./AddTask";

// Define the props interface for the ViewSwitcher component.
interface ViewSwitcherProps {
  setIsChecked: (checked: boolean) => void; // Function to set the checked state of the task list toggle
  setView: (viewMode: ViewMode) => void; // Function to set the current view mode (Day, Week, Month)
  view: ViewMode; // Current view mode of the Gantt chart
  isChecked: boolean; // State to indicate if the task list is visible
  tasks: Task[]; // Array of tasks in the Gantt chart
  setTasks: (tasks: Task[]) => void; // Function to update the tasks array
}

// The ViewSwitcher component manages the task list visibility, view mode switching, and adding a new task.
const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  setIsChecked,
  setView,
  isChecked,
  view,
  tasks,
  setTasks,
}) => {
  // State to track if the screen is wider than 1150px
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1150);
  // useRef to keep track of the previous window width
  const prevWidthRef = useRef(window.innerWidth);

  // useEffect to handle window resize events and update isWideScreen state accordingly
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const prevWidth = prevWidthRef.current;
      const newIsWideScreen = currentWidth > 1150;

      // Update isWideScreen state when crossing the 1150px threshold
      if (
        (prevWidth <= 1150 && currentWidth > 1150) ||
        (prevWidth > 1150 && currentWidth <= 1150)
      ) {
        setIsWideScreen(newIsWideScreen);
      }

      // Update the ref with the current width
      prevWidthRef.current = currentWidth;
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Options for switching between different views (Day, Week, Month).
  const viewsOptions = [
    { value: "Day", onChange: ViewMode.Day },
    { value: "Week", onChange: ViewMode.Week },
    { value: "Month", onChange: ViewMode.Month },
  ];

  // Handle changes to the view mode dropdown selection.
  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOption = viewsOptions.find(
      (option) => option.value === event.target.value
    );
    if (selectedOption) {
      setView(selectedOption.onChange); // Update the view mode in the parent component
    }
  };

  // Handle changes to the task list visibility toggle.
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked); // Update the isChecked state in the parent component
  };

  // Handle the addition of a new task to the task list.
  const handleTaskAdded = (newTask: Task) => {
    setTasks([...tasks, newTask]); 
  };

  return (
    <div className="center-container">
      <div className="heading">
        <h1 id="title">Progression</h1>
        <div id="line"></div>
      </div>
      <div className="view-switcher">
        {/* Toggle for showing or hiding the task list */}
        <div className="Switch">
          <label className="Switch_Toggle">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleChange}
            />
          </label>
          Show Task List
        </div>
        {/* Dropdown menu for selecting the Gantt chart view mode */}
        <div
            className="textField-container frame-size"
            style={{
                marginLeft: isWideScreen ? '50px' : '10px',
                marginTop: '0'
            }}
        >
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
                },
              },
            }}
          >
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
          }}
        >
          {/* Component for adding a new task to the task list */}
          <AddTask
            onTaskAdded={handleTaskAdded}
            tasks={tasks}
            setTasks={setTasks}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewSwitcher;