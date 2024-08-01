import React, { useState, useEffect, useCallback } from "react";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { initTasks, getStartOrEndDate } from "../Tasks";

interface GanttChartProps {
    view: ViewMode;
    isChecked: boolean;
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    handleSelect: (task: Task, isSelected: boolean) => void;
    handleDoubleClick: (task: Task) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({
                                                   view,
                                                   isChecked,
                                                   tasks,
                                                   setTasks,
                                                   handleSelect,
                                                   handleDoubleClick,
                                               }) => {
    const [listCellWidth, setListCellWidth] = useState<string>("");
    const [colswidth, setColsWidth] = useState(() =>
        window.innerWidth <= 1150 ? 100 : 165
    );

    useEffect(() => {
        const fetchTasks = async () => {
            const initTasksGantt = await initTasks();
            setTasks(initTasksGantt);
        };
        fetchTasks();
    }, [setTasks]);

    const progressChangeHandler = useCallback(
        (task: Task) => {
            const newTasks = tasks.map((t) => (t.id === task.id ? { ...task } : t));
            setTasks([...newTasks]);
            console.log("On progress change" + task.id);
        },
        [tasks, setTasks]
    );

    const handleTaskChange = useCallback(
        (task: Task) => {
            console.log("On date change Id:" + task.id);
            let newTasks = tasks.map((t) => (t.id === task.id ? { ...task } : t));
            if (task.project) {
                const [start, end] = getStartOrEndDate(newTasks, task.project);
                const projectIndex = newTasks.findIndex((t) => t.id === task.project);
                if (projectIndex !== -1) {
                    const project = newTasks[projectIndex];
                    if (
                        project.start.getTime() !== start.getTime() ||
                        project.end.getTime() !== end.getTime()
                    ) {
                        const changedProject = { ...project, start, end };
                        newTasks[projectIndex] = changedProject;
                    }
                }
            }
            setTasks([...newTasks]);
        },
        [tasks, setTasks]
    );

    useEffect(() => {
        const handleResize = () => {
            if (isChecked) {
                setColsWidth(window.innerWidth <= 1150 ? 100 : 165);
                setListCellWidth(window.innerWidth <= 1150 ? "125px" : "160px");
            }
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isChecked]);

    if (tasks.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="gantt-container">
            <Gantt
                tasks={tasks}
                viewMode={view}
                onDateChange={handleTaskChange}
                onProgressChange={progressChangeHandler}
                onSelect={handleSelect}
                onDoubleClick={handleDoubleClick} // Handle double click
                arrowColor="#64CCC5"
                barFill={75}
                fontFamily="Montserrat, self-serif"
                listCellWidth={
                    isChecked ? (window.innerWidth <= 1150 ? "100px" : "160px") : ""
                }
                fontSize={
                    isChecked ? (window.innerWidth <= 1150 ? "0.6rem" : "1rem") : "1rem"
                }
                columnWidth={colswidth}
                rowHeight={35}
            />
        </div>
    );
};

export default GanttChart;