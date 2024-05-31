import { Gantt } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { useState, useEffect } from "react";
//import toast from "react-hot-toast";
import { getStartOrEndDate } from "../Helper.ts";
import { initTasks } from "../Tasks";

function GanttChart({ view, isChecked }) {
    const [tasks, setTasks] = useState(initTasks());
    const [listCellWidth, setListCellWidth] = useState("");
    const [colswidth, setColsWidth] = useState(() => {
        return window.innerWidth <= 1150 ? 100 : 165;
    });

    const expanderClickHandler = (task) => {
        let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
        setTasks(newTasks);
        console.log("On ExpanderClick" + task.id);
    };

    const progressChangeHandler = (task) => {
        let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
        setTasks(newTasks);
        console.log("On progress change" + task.id);
    };

    const handleTaskChange = (task) => {
        console.log("on Date Change " + task.id);
        let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
        if (task.project) {
            const [start, end] = getStartOrEndDate(newTasks, task.project);
            const project =
                newTasks[newTasks.findIndex((t) => t.id === task.project)];

            if (
                project.start.getTime() !== start.getTime() ||
                project.end.getTime() !== end.getTime()
            ) {
                const changedProject = { ...project, start, end };
                newTasks.map((t) => (t.id === task.project ? changedProject : t));
            }
        }
        setTasks(newTasks);
    };

    useEffect(() => {
        function handleResize() {
            if (isChecked) {
                setColsWidth(window.innerWidth <= 1150 ? 100 : 165);
                setListCellWidth(window.innerWidth <= 1150 ? "125px" : "160px");
            }
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isChecked]);

    return (
        <div className="gantt-container">
            <Gantt
                tasks={tasks}
                viewMode={view}
                onDateChange={handleTaskChange}
                onProgressChange={progressChangeHandler}
                onExpanderClick={expanderClickHandler}
                arrowColor="#64CCC5"
                barFill="75"
                barProgressColor="#176B87"
                barProgressSelectedColor="#176B87"
                fontFamily="Montserrat, self-serif"
                listCellWidth={isChecked ? (window.innerWidth <= 1150 ? "100px" : "160px") : ""}
                fontSize={isChecked ? (window.innerWidth <= 1150 ? "0.6rem" : "1rem") : "1rem"}
                columnWidth={colswidth}
                rowHeight={40}
            />
        </div>
    );
}

export default GanttChart;