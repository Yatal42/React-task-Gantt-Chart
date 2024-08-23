import { useState, useCallback, useEffect, useRef } from "react";
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
    const [isChecked, setIsChecked] = useState(() => {
        // Retrieve the previous toggle state from localStorage, or default based on window width.
        const savedState = localStorage.getItem('toggleState');
        return savedState ? JSON.parse(savedState) : window.innerWidth > 1150;
    });

    // State to manage the current view mode (e.g., Month, Week) of the Gantt chart.
    const [view, setView] = useState<ViewMode>(ViewMode.Month);

    // useRef to store the previous window width to detect changes in screen size.
    const prevWidthRef = useRef(window.innerWidth);
    
    // useEffect hook to handle window resize events and update `isChecked` when crossing a width threshold.
    useEffect(() => {
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            const prevWidth = prevWidthRef.current;

            if ((prevWidth <= 1150 && currentWidth > 1150) || (prevWidth > 1150 && currentWidth <= 1150)) {
                // Only update isChecked when crossing the 1150px threshold
                setIsChecked(currentWidth > 1150);
            }

            // Update the ref with the current width.
            prevWidthRef.current = currentWidth;
        };

        // Add event listener for window resize.
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount.
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Callback function to handle the selection and unselection of a task.
    const handleSelect = useCallback(
        (task: Task, isSelected: boolean) => {
            // Update the selectedTask state based on whether the task is selected or unselected.
            setSelectedTask(isSelected ? task : null);
            console.log(
                task.name + " has " + (isSelected ? "selected" : "unselected")
            );
        },
        [setSelectedTask]
    );

    return (
        <div className="flex-container">
            {/* ViewSwitcher component manages the view mode, task list settings, and adding new tasks */}
            <ViewSwitcher
                setIsChecked={setIsChecked}
                setView={setView}
                view={view}
                isChecked={isChecked}
                tasks={tasks}
                setTasks={setTasks}
            />
            <div>
                {/* GanttChart component displays the Gantt chart and handles task selection and updates */}
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