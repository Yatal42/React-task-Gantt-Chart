import React, { useState, useEffect, useRef, useCallback } from "react";
import { ViewMode, Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import "./App.css";
import GanttChart from "./GanttChart";
import ViewSwitcher from "./ViewSwitcher";

function App() {
  //const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isChecked, setIsChecked] = useState(true);
  const [view, setView] = useState<ViewMode>(ViewMode.Week);
  const ganttRef = useRef<HTMLDivElement | null>(null);

  // const handleTaskSelection = (task: Task) => {
  //   tasks.setSelectedTask(task);
  // };

  // const handleClickOutsideTask = useCallback((event: MouseEvent) => {
  //   if (ganttRef.current && !ganttRef.current.contains(event.target as Node)) {
  //     tasks.setSelectedTask(null);
  //   }
  // }, []);

  // useEffect(() => {
  //   window.addEventListener('click', handleClickOutsideTask);
  //   return () => {
  //     window.removeEventListener('click', handleClickOutsideTask);
  //   };
  // }, [handleClickOutsideTask]);

  return (
    <div className="flex-container">
      <ViewSwitcher
        setIsChecked={setIsChecked}
        setView={setView}
        isChecked={isChecked}
        tasks={tasks}
      />
      <div ref={ganttRef}>
        <GanttChart isChecked={isChecked} view={view} setTasks={setTasks} tasks={tasks} />
      </div>
    </div>
  );
}

export default App;
