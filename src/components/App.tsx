// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { ViewMode, Task } from "gantt-task-react";
// import "gantt-task-react/dist/index.css";
// import "./App.css";
// import GanttChart from "./GanttChart";
// import ViewSwitcher from "./ViewSwitcher";

// function App() {
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [isChecked, setIsChecked] = useState(true);
//   const [view, setView] = useState<ViewMode>(ViewMode.Week);
//   const ganttRef = useRef<HTMLDivElement | null>(null);

//     const handleClickOutsideTask = useCallback((event: MouseEvent) => {
//       if (ganttRef.current && !ganttRef.current.contains(event.target as Node)) {
//           if (selectedTask) {
//               console.log(`Task ${selectedTask.name} unselected`);
//               setSelectedTask(null);
//           }
//       }
//   }, [selectedTask]);

//   useEffect(() => {
//     window.addEventListener('click', handleClickOutsideTask);
//     return () => {
//       window.removeEventListener('click', handleClickOutsideTask);
//     };
//   }, [handleClickOutsideTask]);

//   return (
//     <div className="flex-container">
//       <ViewSwitcher
//         setIsChecked={setIsChecked}
//         setView={setView}
//         isChecked={isChecked}
//         tasks={tasks}
//         selectedTask={selectedTask}
//       />
//       <div ref={ganttRef}>
//         <GanttChart 
//           isChecked={isChecked} 
//           view={view} 
//           setTasks={setTasks} 
//           tasks={tasks} 
//           setSelectedTask={setSelectedTask} 
//         />
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ViewMode, Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import "./App.css";
import GanttChart from "./GanttChart";
import ViewSwitcher from "./ViewSwitcher";

function App() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isChecked, setIsChecked] = useState(true);
  const [view, setView] = useState<ViewMode>(ViewMode.Week);
  const ganttRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = useCallback((task: Task, isSelected: boolean) => {

    setSelectedTask(isSelected ? task : null);
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  }, [setSelectedTask]);

  const handleClickOutsideTask = useCallback((event: MouseEvent) => {
    if (ganttRef.current && !ganttRef.current.contains(event.target as Node)) {
      if (selectedTask) {
        handleSelect(selectedTask, false);
      }
    }
  }, [selectedTask, handleSelect]);

  useEffect(() => {
    window.addEventListener('click', handleClickOutsideTask);
    return () => {
      window.removeEventListener('click', handleClickOutsideTask);
    };
  }, [handleClickOutsideTask]);

  return (
    <div className="flex-container">
      <ViewSwitcher
        setIsChecked={setIsChecked}
        setView={setView}
        isChecked={isChecked}
        tasks={tasks}
        setTasks={setTasks}
        selectedTask={selectedTask}
      />
      <div ref={ganttRef}>
        <GanttChart 
          isChecked={isChecked} 
          view={view} 
          setTasks={setTasks} 
          tasks={tasks} 
          setSelectedTask={setSelectedTask} 
          handleSelect={handleSelect}
        />
      </div>
    </div>
  );
}

export default App;

