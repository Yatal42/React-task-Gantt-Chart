import React, { useState, useCallback} from "react";
import { ViewMode, Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import "./App.css";
import GanttChart from "./GanttChart";
import Heading from "./Heading";
import TodoList from "./TodoList";

const App: React.FC = () => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isChecked, setIsChecked] = useState<boolean>(() => {
        const savedState = localStorage.getItem('toggleState');
        return savedState ? JSON.parse(savedState) : window.innerWidth > 1150;
    });
    const [view, setView] = useState<ViewMode>(ViewMode.Month);
    
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
        <div>
            <div className="header-container">
                <Heading
                    setIsChecked={setIsChecked}
                    setView={setView}
                    view={view}
                    isChecked={isChecked}
                    tasks={tasks}
                    setTasks={setTasks}
                />
            </div>
            <div className="gantt-container">
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
            <div className="todo-container">
                <TodoList />
            </div>
        </div>
    );
}

export default App;