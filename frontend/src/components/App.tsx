import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import { ViewMode, Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import "./App.css";
import GanttChart from "./GanttChart";
import Heading from "./Heading";

const App: React.FC = () => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isChecked, setIsChecked] = useState<boolean>(() => {
        const savedState = localStorage.getItem('toggleState');
        return savedState ? JSON.parse(savedState) : window.innerWidth > 1150;
    });
    const [view, setView] = useState<ViewMode>(ViewMode.Month);
    const prevWidthRef = useRef<number>(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            const prevWidth = prevWidthRef.current;

            if ((prevWidth <= 1150 && currentWidth > 1150) || (prevWidth > 1150 && currentWidth <= 1150)) {
                setIsChecked(currentWidth > 1150);
            }
            prevWidthRef.current = currentWidth;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
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
            <Heading
                setIsChecked={setIsChecked}
                setView={setView}
                view={view}
                isChecked={isChecked}
                tasks={tasks}
                setTasks={setTasks}
            />
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
    );
}

export default App;