import React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode, Task } from "gantt-task-react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import AddTask from "./AddTask";

interface ViewSwitcherProps {
  setIsChecked: (checked: boolean) => void;
  setView: (viewMode: ViewMode) => void;
  view: ViewMode;
  isChecked: boolean;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
                                                     setIsChecked,
                                                     setView,
                                                     isChecked,
                                                     view,
                                                     tasks,
                                                     setTasks,
                                                   }) => {
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOption = viewsOptions.find(
        (option) => option.value === event.target.value
    );
    if (selectedOption) {
      setView(selectedOption.onChange);
    }
  };

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
          <div className="textField-container">
            <TextField
                id="outlined-select-view"
                select
                sx={{ minWidth: 150, margin: 5 }}
                label="View options"
                size="small"
                value={view} // Set the value to selectedView state
                onChange={handleChange}
            >
              {viewsOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.value}
                  </MenuItem>
              ))}
            </TextField>
          </div>
          <AddTask onTaskAdded={handleTaskAdded} tasks={tasks} setTasks={setTasks} />
        </div>
      </div>
  );
};

export default ViewSwitcher;