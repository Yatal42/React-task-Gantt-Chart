import React, { useState, useCallback } from "react";
import { ViewMode, Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import "./App.css";
import GanttChart from "./GanttChart";
import ViewSwitcher from "./ViewSwitcher";

// The main App component, which manages the state and layout of the Gantt chart and view switcher.
function App() {
    // State to track the currently selected task.
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    // State to manage the list of tasks to be displayed on the Gantt chart.
    const [tasks, setTasks] = useState<Task[]>([]);
    // State to track whether a specific checkbox is checked (likely related to some filtering or view options).
    const [isChecked, setIsChecked] = useState(true);
    // State to manage the current view mode (e.g., Month, Week) of the Gantt chart.
    const [view, setView] = useState<ViewMode>(ViewMode.Month);

    // Callback function to handle the selection and unselection of a task.
    const handleSelect = useCallback(
        (task: Task, isSelected: boolean) => {
            setSelectedTask(isSelected ? task : null);
            console.log(
                task.name + " has " + (isSelected ? "selected" : "unselected")
            );
        },
        [setSelectedTask]
    );

    return (
        <div className="flex-container">
            {/* ViewSwitcher component manages the view, task list settings and adding new task */}
            <ViewSwitcher
                setIsChecked={setIsChecked}
                setView={setView}
                view={view}
                isChecked={isChecked}
                tasks={tasks}
                setTasks={setTasks}
            />
            <div>
                {/* GanttChart component displays the Gantt chart and handles task changes */}
                <GanttChart
                    isChecked={isChecked}
                    view={view}
                    setTasks={setTasks}
                    tasks={tasks}
                    handleSelect={handleSelect}
                    selectedTask={selectedTask}
                    setSelectedTask={setSelectedTask} 
                />
            </div>
        </div>
    );
}

export default App;