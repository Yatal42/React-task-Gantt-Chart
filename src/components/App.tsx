import React, { useState, useCallback } from "react";
import { ViewMode, Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import "./App.css";
import GanttChart from "./GanttChart";
import ViewSwitcher from "./ViewSwitcher";
import EditMenu from "./EditMenu";

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
                task.name + " has " + (isSelected ? "selected11" : "unselected11")
            );
        },
        [setSelectedTask]
    );

    // Handle double click to unselect a task using handleSelect
    const handleDoubleClick = useCallback(
        (task: Task) => {
            if (selectedTask && selectedTask.id === task.id) {
                handleSelect(task, false); // Use handleSelect to unselect the task
            } else {
                handleSelect(task, true); // Select task if it's not currently selected
            }
        },
        [selectedTask, handleSelect]
    );

    const openEditMenu = (task: Task) => {
        setSelectedTask(task);
    };

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
            <div>
                <GanttChart
                    isChecked={isChecked}
                    view={view}
                    setTasks={setTasks}
                    tasks={tasks}
                    handleSelect={handleSelect}
                    handleDoubleClick={handleDoubleClick}
                    openEditMenu={openEditMenu}
                />
            </div>
        </div>
    );
}

export default App;