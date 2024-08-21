import React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode, Task } from "gantt-task-react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import AddTask from "./AddTask";

// Define the props interface for the ViewSwitcher component.
interface ViewSwitcherProps {
  setIsChecked: (checked: boolean) => void;
  setView: (viewMode: ViewMode) => void;
  view: ViewMode;
  isChecked: boolean;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

// The ViewSwitcher component manages the task list visibility, view mode switching and adding new task.
const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
                                                     setIsChecked,
                                                     setView,
                                                     isChecked,
                                                     view,
                                                     tasks,
                                                     setTasks,
                                                   }) => {
    // Options for switching between different views (Day, Week, Month).
    const viewsOptions = [
    {
      value: "Day",
      onChange: ViewMode.Day,
    },
    {
      value: "Week",
      onChange: ViewMode.Week,
    },
    {
      value: "Month",
      onChange: ViewMode.Month,
    },
  ];

  // Handle changes to the view mode dropdown selection.
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOption = viewsOptions.find(
        (option) => option.value === event.target.value
    );
    if (selectedOption) {
      setView(selectedOption.onChange);
    }
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
                  defaultChecked={isChecked}
                  onClick={() => setIsChecked(!isChecked)}
              />
            </label>
            Show Task List
          </div>
          {/* Dropdown menu for selecting the Gantt chart view mode */}
          <div className="textField-container">
            <TextField
                id="outlined-select-view"
                select
                sx={{ minWidth: 150, margin: 5 }}
                label="View options"
                size="small"
                value={view} 
                onChange={handleChange}
            >
              {viewsOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.value}
                  </MenuItem>
              ))}
            </TextField>
          </div>
          {/* Component for adding a new task to the task list */}
          <AddTask onTaskAdded={handleTaskAdded} tasks={tasks} setTasks={setTasks} />
        </div>
      </div>
  );
};

export default ViewSwitcher;