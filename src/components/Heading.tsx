import React, { useState, useEffect, useRef } from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode, Task } from "gantt-task-react";
import ToolBar from "./ToolBar";

interface HeadingProps {
    setIsChecked: (checked: boolean) => void; // Function to set the checked state of the task list toggle
    setView: (viewMode: ViewMode) => void; // Function to set the current view mode (Day, Week, Month)
    view: ViewMode; // Current view mode of the Gantt chart
    isChecked: boolean; // State to indicate if the task list is visible
    tasks: Task[]; // Array of tasks in the Gantt chart
    setTasks: (tasks: Task[]) => void; // Function to update the tasks array
  }

const Heading: React.FC<HeadingProps>=({setIsChecked, setView, isChecked, view, tasks, setTasks}) =>{
  return (
    <div className="center-heading-container">
      <div className="heading-title">
        <h1 id="title">Task Gantt-Chart</h1>
        <div id="line"></div>
        </div>
        <ToolBar 
            setIsChecked={setIsChecked}
            setView={setView}
            view={view}
            isChecked={isChecked}
            tasks={tasks}
            setTasks={setTasks}
        />
    </div>
  );
}


export default Heading;