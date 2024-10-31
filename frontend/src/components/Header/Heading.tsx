import React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode, Task } from "gantt-task-react";
import ToolBar from "../ToolBar/ToolBar";
import './Heading.css';

interface HeadingProps {
    setIsChecked: (checked: boolean) => void; 
    setView: (viewMode: ViewMode) => void; 
    view: ViewMode; 
    isChecked: boolean; 
    tasks: Task[]; 
    setTasks: (tasks: Task[]) => void; 
  }

const Heading: React.FC<HeadingProps>=({setIsChecked, setView, isChecked, view, tasks, setTasks}) =>{
  return (
    <div className="heading">
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