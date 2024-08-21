import React, { useState, useCallback } from "react";
import { ViewMode, Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import "./App.css";
import GanttChart from "./GanttChart";
import ViewSwitcher from "./ViewSwitcher";

function App() {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isChecked, setIsChecked] = useState(true);
    const [view, setView] = useState<ViewMode>(ViewMode.Month);

    // Handle task selection and unselection
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
            <ViewSwitcher
                setIsChecked={setIsChecked}
                setView={setView}
                view={view}
                isChecked={isChecked}
                tasks={tasks}
                setTasks={setTasks}
            />
            <div>
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