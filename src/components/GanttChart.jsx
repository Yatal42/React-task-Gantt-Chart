import { Gantt, Task, ViewMode} from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import {useState} from "react";
import toast from "react-hot-toast";
import { getStartOrEndDate } from "../Helper.ts";
import {initTasks} from "../Tasks";


function GanttChart ({view,isChecked}) {
    const [tasks, setTasks] = useState(initTasks);

    // const deleteHandler = (task: Task) => {
    //     let ok = window.confirm("Are you sure about : " + task.name + " ? ");
    //
    //     if (ok) {
    //         setTasks(tasks.filter((t) => t.id !== task.id));
    //     }
    //     return ok;
    // };

    // const doubleClickHandler = (task: Task) => {
    //     toast.success("Event Id: " + task.id, {
    //         style: {
    //             borderRadius: "10px",
    //             background: "#333",
    //             color: "#fff",
    //         },
    //         duration: 1000,
    //     });
    // };

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
                const changedProject = {...project, start, end};
                newTasks.map((t) => (t.id === task.project ? changedProject : t));
            }
        }
        setTasks(newTasks);
    };

    let colswidth = 165;
    if (view === ViewMode.Hour) {
        colswidth = 150;
    }
    if (view === ViewMode.Year) {
        colswidth = 310;
    }
    if (view === ViewMode.Month) {
        colswidth = 250;
    }
    if (view === ViewMode.Week) {
        colswidth = 200;
    }

    return (
        <div className="gantt-container">
            <Gantt
                tasks={tasks}
                viewMode={view}
                onDateChange={handleTaskChange}
                onProgressChange={progressChangeHandler}
                onExpanderClick={expanderClickHandler}
                // onDoubleClick={doubleClickHandler}
                // onDelete={deleteHandler}
                listCellWidth={isChecked ? "160px" : ""}
                columnWidth={colswidth}
                rowHeight={40}
                // arrowColor="#00FF00"
            />
        </div>
    );
};

export default GanttChart;

